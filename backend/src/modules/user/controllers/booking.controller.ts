import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import crypto from "crypto";
import {
  User,
  Customer,
  Vendor,
  Booking,
  Service,
  Salon,
  Spa,
  Address, // Add Address
} from "../../../models/index.js";
import Transaction from "../../../models/transaction.model.js";
import { checkAvailability } from "../services/booking.service.js";
import { notifyNewBooking, notifyBookingStatusUpdate } from "../../../utils/notificationHelper.js";

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { serviceId, date, time, notes, address, professionalId } = req.body;

    const service = await Service.findById(serviceId)
      .populate("salon")
      .session(session);
    if (!service) {
      res.status(404);
      throw new Error("Service not found");
    }

    // Check availability
    const availability = await checkAvailability(
      (service.salon as any)._id.toString(),
      new Date(date),
      time,
      service.duration,
      professionalId,
      session
    );

    if (!availability.available) {
      res.status(400);
      throw new Error(availability.message || "Slot not available");
    }

    const bookingData = {
      user: req.user._id,
      salon: service.salon,
      onModel: (service as any).onModel || 'Salon',
      service: service._id,
      professional: availability.staffId || null,
      date,
      time,
      type: service.type,
      title: service.name, // Save snapshot
      price: service.price,
      notes,
      address,
    };

    if (service.type === 'at-home' && address) {
      // Find the address document to get coordinates
      // address string might be formatted, so we might need a better way or assume address matches one in DB
      // Ideally we should pass addressId but legacy code passes full address string.
      // Let's try to match by user and address string or just fetch latest/default if ambiguity.
      // Better approach: Since we can't easily match string back to ID, and we just added Geo to Address,
      // we'll assume the client sends addressId if possible OR we find an address that matches the string line.
      // However, to be safe and robust given current contract:
      // We will look for an address doc that constructs to this string, OR simply change contract to send addressId.
      // Given I can change frontend, I will update frontend to send addressId in a moment.
      // For now, let's try to find an address with this address string (exact match might be tricky).
      // Let's modify this to accept addressId optionally or handle it.

      // Attempt to find address by matching string fields is risky.
      // I will update the logic to check if 'address' is actually an ID (MongoID).
      // If it is an ID, fetch it. If not, it's a legacy string string.

      if (mongoose.isValidObjectId(address)) {
        const addressDoc = await Address.findById(address).session(session);
        if (addressDoc && addressDoc.geo && addressDoc.geo.coordinates) {
          (bookingData as any).geo = addressDoc.geo;
          // Also store the formatted text if needed, or keep address as ID?
          // Model says address: String.
          // If we save ID here, legacy UI might break if it expects text.
          // So we should save text in 'address' and geo in 'geo'.
          bookingData.address = `${addressDoc.addressLine1}, ${addressDoc.addressLine2 ? addressDoc.addressLine2 + ', ' : ''}${addressDoc.city}, ${addressDoc.state} - ${addressDoc.pincode}`;
        }
      }
    }

    const [booking] = await Booking.create([bookingData], { session });

    await session.commitTransaction();
    session.endSession();

    // Notify admin about new booking asynchronously
    try {
      const customer = await Customer.findOne({ user: req.user._id }).select("name");
      const customerName = customer?.name || "Customer";
      const salonName = (service.salon as any).name || "Salon";

      if (booking) {
        notifyNewBooking(customerName, salonName, booking._id.toString());
      }
    } catch (err) {
      console.error("Error sending booking notification:", err);
    }

    res.status(201).json(booking);
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
export const getUserBookings = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("salon", "name location images geo")
      .populate("service", "name price duration image")
      .sort("-date");

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark booking as paid (simple/mock)
// @route   POST /api/bookings/:id/pay
// @access  Private
export const payBooking = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      res.status(404);
      return next(new Error("Booking not found"));
    }

    booking.paymentStatus = "paid";
    await booking.save();

    res.status(200).json({ message: "Booking paid successfully", booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("salon");

    if (!booking) {
      res.status(404);
      return next(new Error("Booking not found"));
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error("Not authorized"));
    }

    booking.status = "cancelled";
    await booking.save();

    // Notify user
    try {
      const salonName = (booking.salon as any)?.name || "Salon";
      await notifyBookingStatusUpdate(
        req.user._id.toString(),
        booking._id.toString(),
        "CANCELLED",
        salonName
      );
    } catch (err) {
      console.error("Failed to notify user/admin of cancellation:", err);
    }

    res
      .status(200)
      .json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking details
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingDetails = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingRaw = await Booking.findById(req.params.id)
      .populate("salon")
      .populate("service")
      .populate("user", "phone email role")
      .lean();

    if (!bookingRaw) {
      res.status(404);
      return next(new Error("Booking not found"));
    }

    const booking = bookingRaw as any;

    // Check if user owns the booking or is admin/vendor
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role === "CUSTOMER"
    ) {
      res.status(401);
      return next(new Error("Not authorized"));
    }

    // Fetch name from profile
    let profile: any = null;
    if (booking.user?.role === "CUSTOMER") {
      profile = await Customer.findOne({ user: booking.user._id }).lean();
    } else if (booking.user?.role === "VENDOR") {
      profile = await Vendor.findOne({ user: booking.user._id }).lean();
    }

    booking.user = {
      ...booking.user,
      name: profile?.name || profile?.ownerName || "User",
    };

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Update/Reschedule booking
// @route   PATCH /api/bookings/:id
// @access  Private
export const updateBooking = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, time, notes, address } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      return next(new Error("Booking not found"));
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error("Not authorized"));
    }

    if (booking.status !== "upcoming") {
      res.status(400);
      return next(new Error("Can only reschedule upcoming bookings"));
    }

    if (date) booking.date = date;
    if (time) booking.time = time;
    if (notes) booking.notes = notes;
    if (address) booking.address = address;

    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Create Razorpay order for a booking
// @route   POST /api/bookings/:id/create-razorpay-order
// @access  Private
export const createRazorpayOrder = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      return next(new Error("Booking not found"));
    }

    if (booking.paymentStatus === "paid") {
      res.status(400);
      return next(new Error("Booking is already paid"));
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mock_id",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "mock_secret",
    });

    const options = {
      amount: booking.price * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${booking._id}`,
    };

    const order = await instance.orders.create(options);

    // Create a pending transaction
    await Transaction.create({
      user: req.user._id,
      booking: booking._id,
      amount: booking.price,
      gatewayOrderId: order.id,
      paymentGateway: "razorpay",
      status: "pending",
    });

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/bookings/verify-payment
// @access  Private
export const verifyRazorpayPayment = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking_id,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "mock_secret")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment successful
      const transaction = await Transaction.findOne({
        gatewayOrderId: razorpay_order_id,
      });

      if (!transaction) {
        res.status(404);
        return next(new Error("Transaction record not found"));
      }

      transaction.status = "success";
      transaction.gatewayTransactionId = razorpay_payment_id;
      await transaction.save();

      const booking = await Booking.findById(booking_id).populate("salon");
      if (booking) {
        const salon = booking.salon as any;
        const commissionRate = salon.commissionRate || 15;
        const commissionAmount = (booking.price * commissionRate) / 100;
        const vendorEarnings = booking.price - commissionAmount;

        booking.paymentStatus = "paid";
        booking.commissionAmount = commissionAmount;
        booking.vendorEarnings = vendorEarnings;
        await booking.save();
      }

      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      res.status(400);
      return next(new Error("Invalid payment signature"));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Pay for booking using wallet
// @route   POST /api/bookings/:id/pay-wallet
// @access  Private
export const payWithWallet = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(req.params.id).session(session);

    if (!booking) {
      res.status(404);
      throw new Error("Booking not found");
    }

    if (booking.paymentStatus === "paid") {
      res.status(400);
      throw new Error("Booking is already paid");
    }

    const customer = await Customer.findOne({ user: req.user._id }).session(
      session
    );
    if (!customer) {
      res.status(404);
      throw new Error("Customer profile not found");
    }

    if ((customer.walletBalance || 0) < booking.price) {
      res.status(400);
      throw new Error("Insufficient wallet balance");
    }

    // Deduct from wallet
    customer.walletBalance = (customer.walletBalance || 0) - booking.price;
    await customer.save({ session });

    // Create transaction record
    await Transaction.create(
      [
        {
          user: req.user._id,
          booking: booking._id,
          amount: booking.price,
          paymentGateway: "wallet",
          transactionType: "debit",
          status: "success",
        },
      ],
      { session }
    );

    // Update booking payment status
    const Model = booking.onModel === 'Spa' ? Spa : Salon;
    const business = await Model.findById(booking.salon);
    const commissionRate = business?.commissionRate || 15;
    const commissionAmount = (booking.price * commissionRate) / 100;
    const vendorEarnings = booking.price - commissionAmount;

    booking.paymentStatus = "paid";
    booking.commissionAmount = commissionAmount;
    booking.vendorEarnings = vendorEarnings;
    await booking.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Payment successful via wallet" });
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
