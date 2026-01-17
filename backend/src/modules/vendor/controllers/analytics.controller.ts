import type { Response, NextFunction } from "express";
import Salon from "../../../models/salon.model.js";
import Booking from "../../../models/booking.model.js";
import Customer from "../../../models/customer.model.js";

// @desc    Get vendor statistics for analytics
// @route   GET /api/vendor/stats
// @access  Private/Vendor
export const getVendorStats = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const salon = await Salon.findOne({ vendor: req.user._id });
        if (!salon) {
            return res.status(200).json({
                revenue: { total: 0, thisMonth: 0, lastMonth: 0, change: 0 },
                bookings: { total: 0, thisMonth: 0, lastMonth: 0, change: 0 },
                avgRating: 0,
            });
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const allBookings = await Booking.find({ salon: salon._id });
        const thisMonthBookings = allBookings.filter(
            (b) => new Date(b.date) >= startOfMonth
        );
        const lastMonthBookings = allBookings.filter(
            (b) =>
                new Date(b.date) >= startOfLastMonth &&
                new Date(b.date) <= endOfLastMonth
        );

        const calculateStats = (bookings: any[]) => {
            const completed = bookings.filter((b) => b.status === "completed");
            return {
                count: bookings.length,
                revenue: completed.reduce((acc, b) => acc + (b.vendorEarnings || 0), 0),
            };
        };

        const calculateChange = (curr: number, prev: number) => {
            if (prev === 0) return curr > 0 ? 100 : 0;
            return Math.round(((curr - prev) / prev) * 100);
        };

        const thisMonthStats = calculateStats(thisMonthBookings);
        const lastMonthStats = calculateStats(lastMonthBookings);
        const totalStats = calculateStats(allBookings);

        res.status(200).json({
            revenue: {
                total: totalStats.revenue,
                thisMonth: thisMonthStats.revenue,
                lastMonth: lastMonthStats.revenue,
                change: calculateChange(thisMonthStats.revenue, lastMonthStats.revenue),
            },
            bookings: {
                total: totalStats.count,
                thisMonth: thisMonthStats.count,
                lastMonth: lastMonthStats.count,
                change: calculateChange(thisMonthStats.count, lastMonthStats.count),
            },
            avgRating: salon.rating,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get vendor's customers (optimized aggregation)
// @route   GET /api/vendor/customers
// @access  Private/Vendor
export const getVendorCustomers = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const salon = await Salon.findOne({ vendor: req.user._id });
        if (!salon) return res.status(200).json([]);

        // Aggregation to get unique customers, their stats, and profile info
        const customerStats = await Booking.aggregate([
            { $match: { salon: salon._id } },
            {
                $group: {
                    _id: "$user",
                    totalBookings: { $sum: 1 },
                    totalSpent: { $sum: "$price" },
                    lastVisit: { $max: "$date" },
                    bookings: { $push: "$$ROOT" }
                }
            },
            {
                $lookup: {
                    from: "customers",
                    localField: "_id",
                    foreignField: "user",
                    as: "profile"
                }
            },
            { $unwind: "$profile" },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userAuth"
                }
            },
            { $unwind: "$userAuth" },
            {
                $project: {
                    id: "$_id",
                    _id: 1,
                    name: "$profile.name",
                    email: { $ifNull: ["$profile.email", "$userAuth.email"] },
                    phone: "$userAuth.phone",
                    avatar: "$profile.avatar",
                    status: { $ifNull: ["$profile.status", "active"] },
                    totalBookings: 1,
                    totalSpent: 1,
                    lastVisit: 1,
                }
            },
            { $sort: { lastVisit: -1 } }
        ]);

        res.status(200).json(customerStats);
    } catch (error) {
        next(error);
    }
};

// @desc    Get detailed customer info with booking history
// @route   GET /api/vendor/customers/:id
// @access  Private/Vendor
export const getVendorCustomerDetails = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const salon = await Salon.findOne({ vendor: req.user._id });
        if (!salon) throw new Error("Salon not found");

        const customerUserId = req.params.id;

        const profile = await Customer.findOne({ user: customerUserId }).populate("user", "phone email");
        if (!profile) {
            res.status(404);
            return next(new Error("Customer profile not found"));
        }

        const bookings = await Booking.find({
            salon: salon._id,
            user: customerUserId
        })
            .populate("service", "name price")
            .populate("package", "title price")
            .sort("-date");

        const stats = {
            totalBookings: bookings.length,
            totalSpent: bookings.reduce((acc, b) => acc + (b.price || 0), 0),
            lastVisit: bookings[0]?.date || null,
            averageOrderValue: bookings.length > 0 ?
                Math.round(bookings.reduce((acc, b) => acc + (b.price || 0), 0) / bookings.length) : 0,
            preferredServices: Array.from(new Set(bookings.map(b => (b.service as any)?.name || (b.package as any)?.title))).slice(0, 3)
        };

        res.status(200).json({
            id: customerUserId,
            _id: customerUserId,
            name: profile.name,
            phone: (profile.user as any)?.phone,
            email: profile.email || (profile.user as any)?.email,
            avatar: profile.avatar,
            address: profile.get("location") || "",
            status: profile.get("status") || "active",
            notes: profile.get("notes") || "",
            ...stats,
            bookings: bookings.map(b => ({
                id: b._id,
                _id: b._id,
                service: (b.service as any)?.name || (b.package as any)?.title || "Unknown Service",
                date: b.date,
                time: b.time,
                amount: b.price,
                status: b.status
            }))
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update customer profile from vendor end
// @route   PATCH /api/vendor/customers/:id
// @access  Private/Vendor
export const updateVendorCustomer = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const customerUserId = req.params.id;
        const updates = req.body;

        const customer = await Customer.findOne({ user: customerUserId });
        if (!customer) {
            res.status(404);
            return next(new Error("Customer not found"));
        }

        // Map 'address' from frontend to 'location' in schema
        if (updates.address !== undefined) {
            updates.location = updates.address;
            delete updates.address;
        }

        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined) {
                customer.set(key, updates[key]);
            }
        });

        await customer.save();

        res.status(200).json({
            success: true,
            message: "Customer updated"
        });
    } catch (error) {
        next(error);
    }
};
