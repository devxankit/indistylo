import type { Request, Response, NextFunction } from "express";
import { User, Vendor, Customer, Salon, Booking, Service } from "../../../models/index.js";

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const totalCustomers = await User.countDocuments({ role: "CUSTOMER" });
        const totalVendors = await Vendor.countDocuments({ status: "active" });
        const totalSalons = await Salon.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalServices = await Service.countDocuments();

        // Revenue calculations
        const bookings = await Booking.find({ paymentStatus: "paid" });
        const totalRevenue = bookings.reduce((acc, b) => acc + b.price, 0);
        const totalCommission = bookings.reduce(
            (acc, b) => acc + (b.commissionAmount || 0),
            0
        );

        // Monthly stats
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthBookings = await Booking.find({
            createdAt: { $gte: startOfMonth },
            paymentStatus: "paid",
        });
        const monthlyRevenue = thisMonthBookings.reduce((acc, b) => acc + b.price, 0);
        const monthlyCommission = thisMonthBookings.reduce(
            (acc, b) => acc + (b.commissionAmount || 0),
            0
        );

        // Recent bookings with user names from profiles
        const recentBookingsRaw = await Booking.find()
            .sort("-createdAt")
            .limit(10)
            .populate("user", "phone email role")
            .populate("salon", "name")
            .populate("service", "name price")
            .lean();

        const recentBookings = await Promise.all(
            recentBookingsRaw.map(async (booking: any) => {
                let profile: any = null;
                if (booking.user?.role === "CUSTOMER") {
                    profile = await Customer.findOne({ user: booking.user._id }).lean();
                } else if (booking.user?.role === "VENDOR") {
                    profile = await Vendor.findOne({ user: booking.user._id }).lean();
                }
                return {
                    ...booking,
                    user: {
                        ...booking.user,
                        name: profile?.name || profile?.ownerName || "User",
                    }
                };
            })
        );

        // Pending vendors from Vendor model
        const pendingVendorProfiles = await Vendor.find({
            status: "pending",
        }).limit(5).populate("user", "phone email").lean();

        const pendingVendors = pendingVendorProfiles.map(p => ({
            _id: p.user?._id,
            name: p.ownerName,
            businessName: p.businessName,
            phone: (p.user as any)?.phone,
            email: p.email || (p.user as any)?.email,
            status: p.status,
            createdAt: (p as any).createdAt,
        }));

        // Fetch Admin Wallet Balance (Assuming single super admin or first admin)
        const adminProfile = await import("../../../models/admin.model.js").then(m => m.default.findOne({ isSuperAdmin: true })) ||
            await import("../../../models/admin.model.js").then(m => m.default.findOne());

        // Calculate monthly revenue for chart (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const revenueStats = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    revenue: { $sum: "$price" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const chartData = revenueStats.map(stat => {
            const date = new Date(stat._id.year, stat._id.month - 1);
            return {
                name: date.toLocaleString('default', { month: 'short' }),
                revenue: stat.revenue
            };
        });

        res.status(200).json({
            stats: {
                totalCustomers,
                totalVendors,
                totalBookings,
                totalRevenue,
                pendingApprovals: await Vendor.countDocuments({ status: "pending" }),
                adminWallet: adminProfile?.walletBalance || 0,
            },
            chartData,
            recentBookings,
            pendingVendors,
        });
    } catch (error) {
        next(error);
    }
};
