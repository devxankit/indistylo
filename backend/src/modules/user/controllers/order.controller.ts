import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import {
    User,
    Customer,
    Booking,
    Service,
    Order,
    Package,
    Transaction,
    Vendor,
    Admin,
    Content
} from "../../../models/index.js";
import { checkAvailability } from "../services/booking.service.js";
import { notifyOrderStatusUpdate } from "../../../utils/notificationHelper.js";
import { createRazorpayOrder, verifyRazorpaySignature, getRazorpayKeyId } from "../services/payment.service.js";

// @desc    Create new order (multiple bookings)
// @route   POST /api/orders
// @access  Private
export const createOrder = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { items, date, time, notes, address, professionalId, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            res.status(400);
            throw new Error("No items in order");
        }

        // items should be an array of { type: 'service' | 'package', id: string, quantity: number }
        // For now, we assume quantity is 1 for simplicity in availability check or handle it

        let totalDuration = 0;
        let totalPrice = 0;
        let salonId = null;
        const bookingItems = [];
        const orderSnapshotItems: any[] = [];

        // 1. Validate items and calculate totals
        for (const item of items) {
            if (item.type === "service") {
                const service = await Service.findById(item.id).populate("salon").session(session);
                if (!service) throw new Error(`Service ${item.id} not found`);

                if (!salonId) salonId = (service.salon as any)._id.toString();
                else if (salonId !== (service.salon as any)._id.toString()) {
                    throw new Error("All items must be from the same salon");
                }

                totalDuration += service.duration * item.quantity;
                totalPrice += service.price * item.quantity;

                orderSnapshotItems.push({
                    name: service.name,
                    type: 'service',
                    price: service.price,
                    quantity: item.quantity
                });

                for (let i = 0; i < item.quantity; i++) {
                    bookingItems.push({
                        type: 'service',
                        data: service,
                        price: service.price
                    });
                }


            } else if (item.type === "package") {
                const pkg = await Package.findById(item.id).populate("services").session(session);
                if (!pkg) throw new Error("Package " + item.id + " not found");

                // You might need to fetch salon from the package's vendor or attach salon to package
                // Assuming package belongs to a vendor who owns a salon, or we find salon via linked services?
                // For simplicity, if package doesn't have direct salon ref, we might need to look it up.
                // Let's assume passed salonId or infer from first item if it's mixed, 
                // OR simpler: Package is linked to Vendor, Vendor has Salon. 
                // But the current Package model has 'vendor'.
                // We need to resolve Salon for the Package. 
                // Let's assume for now mixed orders are rare or frontend ensures context.
                // If salonId is passed in body use that, else try to infer.

                // Infer duration from services in package
                let pkgDuration = 0;
                if (pkg.services && pkg.services.length > 0) {
                    for (const s of pkg.services) {
                        const srv = await Service.findById(s).session(session);
                        if (srv) pkgDuration += srv.duration;
                    }
                }
                // If package has no services (custom deal?), assume 60 mins or 0? 
                if (pkgDuration === 0) pkgDuration = 60; // Default fallback

                totalDuration += pkgDuration * item.quantity;
                totalPrice += pkg.price * item.quantity;

                orderSnapshotItems.push({
                    name: pkg.name,
                    type: 'package',
                    price: pkg.price,
                    quantity: item.quantity
                });

                for (let i = 0; i < item.quantity; i++) {
                    bookingItems.push({
                        type: 'package',
                        data: pkg,
                        price: pkg.price,
                        duration: pkgDuration
                    });
                }
            }
        }

        if (!salonId && req.body.salonId) {
            salonId = req.body.salonId;
        }

        if (!salonId) {
            throw new Error("Could not determine salon for this order");
        }

        // 2. Check Availability for the TOTAL duration
        // We assume sequential execution by the same professional if selected, or any available.
        // If professionalId is 'any', checkAvailability finds one who is free for totalDuration.
        const availability = await checkAvailability(
            salonId,
            new Date(date),
            time,
            totalDuration,
            professionalId === 'any' ? undefined : professionalId,
            session
        );

        if (!availability.available) {
            res.status(400);
            throw new Error(availability.message || "Slot not available for the total duration");
        }

        const assignedStaffId = availability.staffId;

        // 3. Create Order
        const [order] = await Order.create([{
            user: req.user._id,
            salon: salonId,
            onModel: (bookingItems[0]?.data as any)?.onModel || 'Salon',
            totalAmount: totalPrice,
            status: "pending", // Always pending until paid
            paymentStatus: "pending",
            bookings: [],
            items: orderSnapshotItems, // Save snapshot items
            paymentMethod: "online" // ENFORCED
        }], { session }) as any[];

        if (!order) throw new Error("Failed to create order");

        // 4. Create Bookings
        const createdBookings = [];
        let currentTimeOffset = 0; // minutes
        // We need to properly schedule start times for each service if we want them detailed
        // Or just mark them all at the same start time? 
        // Better: Sequence them.

        const startTimeMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);

        for (const item of bookingItems) {
            let itemDuration = 0;
            let itemType = 'at-salon'; // default

            if (item.type === 'service') {
                itemDuration = (item.data as any)?.duration || 30;
                itemType = (item.data as any)?.type || 'at-salon';
            } else {
                itemDuration = (item as any)?.duration || 60;
                itemType = (item.data as any)?.type || 'package';
            }

            // Calculate specific start time for this item
            const currentStartMin = startTimeMinutes + currentTimeOffset;
            const currentHour = Math.floor(currentStartMin / 60);
            const currentMin = currentStartMin % 60;
            const currentBtTime = currentHour.toString().padStart(2, '0') + ":" + currentMin.toString().padStart(2, '0');

            const bookingData: any = {
                user: req.user._id,
                salon: salonId,
                onModel: (item.data as any)?.onModel || 'Salon',
                professional: assignedStaffId,
                date: date, // Same date
                time: currentBtTime,
                type: itemType,
                title: (item.data as any).name, // Save snapshot title
                price: item.price,
                duration: itemDuration,
                status: "pending", // Always pending initially
                paymentStatus: "pending",
                order: order._id,
                address: address, // For at-home
                paymentMethod: "online", // ENFORCED
                notes: notes
            };

            if (item.type === 'service') {
                bookingData.service = (item.data as any)._id;
            } else {
                bookingData.package = (item.data as any)._id;
                // booking.service is optional now
            }

            const [booking] = await Booking.create([bookingData], { session }) as any[];
            if (!booking) throw new Error("Failed to create booking");
            createdBookings.push(booking._id);

            currentTimeOffset += itemDuration;
        }

        // Update order with bookings
        order.bookings = createdBookings;
        await order.save({ session });

        // 5. Handle Payment (Create Transaction) - Optional if they want to pay now
        // If payment method is online, we might generate Razorpay order here or in a separate step?
        // The requirement often is create order -> return ID -> frontend calls Pay -> verify -> update status.
        // So we just return the order here.

        // ALWAYS Create Razorpay Order
        const razorpayOrder = await createRazorpayOrder(totalPrice, order._id.toString());
        // razorpayOrderData = razorpayOrder; // Removed: Not needed if we use razorpayOrder directly
        order.razorpayOrderId = razorpayOrder.id;
        await order.save({ session });
        const keyId = getRazorpayKeyId();

        // Create Transaction record as pending
        await Transaction.create([{
            user: req.user._id,
            order: order._id,
            amount: totalPrice,
            paymentGateway: "razorpay",
            status: "pending",
            transactionType: "debit",
            gatewayOrderId: razorpayOrder.id,
            paymentMethod: "online"
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ order, razorpayOrderId: razorpayOrder.id, keyId });

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("salon", "name location images")
            .populate({
                path: "bookings",
                populate: [
                    { path: "service", select: "name price duration image" },
                    { path: "package", select: "name price description image" }
                ]
            })
            .sort("-createdAt");

        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
}

// @desc    Mark order as paid
// @route   POST /api/orders/:id/pay
// @access  Private
export const payOrder = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const order = await Order.findById(req.params.id).session(session);
        if (!order) {
            res.status(404);
            throw new Error("Order not found");
        }

        if (order.paymentStatus === "paid") {
            res.status(400);
            throw new Error("Order is already paid");
        }

        // Update Order status
        order.paymentStatus = "paid";
        order.status = "confirmed"; // Auto-confirm on payment
        await order.save({ session });

        // Update all related bookings and Distribute Earnings
        const bookings = await Booking.find({ _id: { $in: order.bookings } }).populate("salon").session(session);

        const admin = await Admin.findOne({ isSuperAdmin: true }).session(session) || await Admin.findOne().session(session);
        // Get global commission rate as default
        const settings = await Content.findOne({ type: "settings" }).session(session);
        const defaultCommissionRate = settings?.data?.commissionRate || 10;

        for (const booking of bookings) {
            booking.paymentStatus = "paid";
            booking.status = "upcoming";

            const salon = booking.salon as any;
            if (salon && salon.vendor) {
                const vendorProfile = await Vendor.findOne({ user: salon.vendor }).session(session);
                if (vendorProfile) {
                    const commissionRate = vendorProfile.commissionRate || defaultCommissionRate;
                    const commissionAmount = (booking.price * commissionRate) / 100;
                    const vendorEarnings = booking.price - commissionAmount;

                    // Update Booking financials
                    booking.commissionAmount = commissionAmount;
                    booking.vendorEarnings = vendorEarnings;

                    // Update Vendor Wallet
                    vendorProfile.walletBalance = (vendorProfile.walletBalance || 0) + vendorEarnings;
                    await vendorProfile.save({ session });

                    // Update Admin Wallet
                    if (admin) {
                        admin.walletBalance = (admin.walletBalance || 0) + commissionAmount;
                    }
                }
            }
            await booking.save({ session });
        }

        if (admin) {
            await admin.save({ session });
        }

        // Create Transaction (Mock/Real)
        await Transaction.create([{
            user: req.user._id,
            order: order._id,
            amount: order.totalAmount,
            paymentGateway: req.body.paymentGateway || "razorpay",
            status: "success",
            transactionType: "debit",
            gatewayTransactionId: req.body.transactionId || ("tx_" + Date.now())
        }], { session });

        await session.commitTransaction();
        session.endSession();

        // Notify User
        notifyOrderStatusUpdate(req.user._id.toString(), order._id.toString(), "CONFIRMED");

        res.status(200).json({ message: "Order paid successfully", order });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/orders/verify-payment
// @access  Private
export const verifyPayment = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        const isValid = verifyRazorpaySignature(
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        );

        if (!isValid) {
            res.status(400);
            throw new Error("Invalid payment signature");
        }

        const order = await Order.findOne({ razorpayOrderId }).session(session);
        if (!order) {
            res.status(404);
            throw new Error("Order not found");
        }

        if (order.paymentStatus === "paid") {
            // Already paid, just return success
            await session.commitTransaction();
            session.endSession();
            return res.status(200).json({ message: "Payment verified successfully", order });
        }

        order.paymentStatus = "paid";
        order.status = "confirmed";
        await order.save({ session });

        // Update all related bookings and Distribute Earnings
        const bookings = await Booking.find({ _id: { $in: order.bookings } }).populate("salon").session(session);

        const admin = await Admin.findOne({ isSuperAdmin: true }).session(session) || await Admin.findOne().session(session);
        // Get global commission rate as default
        const settings = await Content.findOne({ type: "settings" }).session(session);
        const defaultCommissionRate = settings?.data?.commissionRate || 10;

        for (const booking of bookings) {
            booking.paymentStatus = "paid";
            booking.status = "upcoming";

            const salon = booking.salon as any;
            if (salon && salon.vendor) {
                const vendorProfile = await Vendor.findOne({ user: salon.vendor }).session(session);
                if (vendorProfile) {
                    const commissionRate = vendorProfile.commissionRate || defaultCommissionRate;
                    const commissionAmount = (booking.price * commissionRate) / 100;
                    const vendorEarnings = booking.price - commissionAmount;

                    // Update Booking financials
                    booking.commissionAmount = commissionAmount;
                    booking.vendorEarnings = vendorEarnings;

                    // Update Vendor Wallet
                    vendorProfile.walletBalance = (vendorProfile.walletBalance || 0) + vendorEarnings;
                    await vendorProfile.save({ session });

                    // Update Admin Wallet
                    if (admin) {
                        admin.walletBalance = (admin.walletBalance || 0) + commissionAmount;
                    }
                }
            }
            await booking.save({ session });
        }

        if (admin) {
            await admin.save({ session });
        }

        // Update Transaction
        await Transaction.findOneAndUpdate(
            { gatewayOrderId: razorpayOrderId },
            {
                status: "success",
                gatewayTransactionId: razorpayPaymentId
            }
        ).session(session);

        await session.commitTransaction();
        session.endSession();

        // Notify User
        notifyOrderStatusUpdate(req.user._id.toString(), order._id.toString(), "CONFIRMED");

        res.status(200).json({ message: "Payment verified successfully", order });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};
