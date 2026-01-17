import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

interface NotificationData {
    title: string;
    message: string;
    type: "BOOKING" | "OFFER" | "SYSTEM" | "POINTS";
    link?: string;
    data?: any;
}

/**
 * Create a notification for all admin users
 */
export async function createAdminNotification(notificationData: NotificationData) {
    try {
        // Get all admin users
        const adminUsers = await User.find({ role: "ADMIN" }).select("_id").lean();

        if (adminUsers.length === 0) {
            console.warn("No admin users found to send notification");
            return;
        }

        // Create notification for each admin
        const notifications = adminUsers.map(admin => ({
            recipient: admin._id,
            title: notificationData.title,
            message: notificationData.message,
            type: notificationData.type,
            data: {
                link: notificationData.link,
                ...notificationData.data
            }
        }));

        await Notification.insertMany(notifications);

        console.log(`Created ${notifications.length} admin notifications: ${notificationData.title}`);
    } catch (error) {
        console.error("Error creating admin notification:", error);
    }
}

/**
 * Create notification for new vendor registration
 */
export async function notifyNewVendorRegistration(vendorName: string, vendorId: string) {
    await createAdminNotification({
        title: "New Vendor Registration",
        message: `${vendorName} has registered and is waiting for approval.`,
        type: "SYSTEM",
        link: `/admin/vendors/pending`,
        data: { vendorId }
    });
}

/**
 * Create notification for new booking
 */
export async function notifyNewBooking(customerName: string, salonName: string, bookingId: string) {
    await createAdminNotification({
        title: "New Booking Created",
        message: `${customerName} booked a service at ${salonName}.`,
        type: "BOOKING",
        link: `/admin/bookings`,
        data: { bookingId }
    });
}

/**
 * Create notification for payout request
 */
export async function notifyPayoutRequest(vendorName: string, amount: number, payoutId: string) {
    await createAdminNotification({
        title: "New Payout Request",
        message: `${vendorName} requested a payout of ₹${amount.toLocaleString()}.`,
        type: "SYSTEM",
        link: `/admin/finance/payouts`,
        data: { payoutId, amount }
    });
}

/**
 * Create notification for document upload
 */
export async function notifyDocumentUpload(vendorName: string, vendorId: string) {
    await createAdminNotification({
        title: "Document Uploaded",
        message: `${vendorName} uploaded verification documents for review.`,
        type: "SYSTEM",
        link: `/admin/vendors/${vendorId}`,
        data: { vendorId }
    });
}

/**
 * Create notification for high booking volume
 */
export async function notifyHighBookingVolume(count: number, timeframe: string) {
    await createAdminNotification({
        title: "High Booking Volume",
        message: `${count} bookings created in the last ${timeframe}.`,
        type: "SYSTEM",
        link: `/admin/dashboard`,
        data: { count, timeframe }
    });
}

/**
 * Create a generic notification for a user
 */
export async function createUserNotification(userId: string, notificationData: NotificationData) {
    try {
        await Notification.create({
            recipient: userId,
            title: notificationData.title,
            message: notificationData.message,
            type: notificationData.type,
            data: {
                link: notificationData.link,
                ...notificationData.data
            }
        });
        console.log(`Created user notification for ${userId}: ${notificationData.title}`);
    } catch (error) {
        console.error("Error creating user notification:", error);
    }
}

/**
 * Notify user about order status update
 */
export async function notifyOrderStatusUpdate(userId: string, orderId: string, status: string) {
    let title = "Order Update";
    let message = `Your order #${orderId.slice(-6)} status has been updated to ${status}.`;

    if (status === "CONFIRMED") {
        title = "Order Confirmed";
        message = `Your order #${orderId.slice(-6)} has been confirmed!`;
    } else if (status === "SHIPPED") {
        title = "Order Shipped";
        message = `Your order #${orderId.slice(-6)} is on its way!`;
    } else if (status === "DELIVERED") {
        title = "Order Delivered";
        message = `Your order #${orderId.slice(-6)} has been delivered. Enjoy!`;
    } else if (status === "CANCELLED") {
        title = "Order Cancelled";
        message = `Your order #${orderId.slice(-6)} has been cancelled.`;
    }

    await createUserNotification(userId, {
        title,
        message,
        type: "ORDER" as any, // Using 'ORDER' type which maps to SUCCESS/INFO in controller
        link: `/orders/${orderId}`,
        data: { orderId, status }
    });
}

/**
 * Notify user about booking status update
 */
export async function notifyBookingStatusUpdate(userId: string, bookingId: string, status: string, salonName: string) {
    let title = "Booking Update";
    let message = `Your booking at ${salonName} is now ${status}.`;

    if (status === "CONFIRMED") {
        title = "Booking Confirmed";
        message = `Your booking at ${salonName} has been confirmed. See you there!`;
    } else if (status === "COMPLETED") {
        title = "Booking Completed";
        message = `Hope you enjoyed your service at ${salonName}. Please leave a review!`;
        return await createUserNotification(userId, {
            title,
            message,
            type: "BOOKING",
            link: `/bookings/${bookingId}/review`, // Direct to review if possible
            data: { bookingId, status }
        });
    }

    await createUserNotification(userId, {
        title,
        message,
        type: "BOOKING",
        link: `/bookings/${bookingId}`,
        data: { bookingId, status }
    });
}
