// src/modules/notifications/notifications.service.ts
import { prisma } from "../../config/db";
import { NotificationType, NotificationChannel } from "@prisma/client";
import { io } from "../../server"; // Will be exported from server.ts

// export async function createNotification(data: {
//     userId: string;
//     senderId?: string;
//     reportId?: string;
//     type: NotificationType;
//     title: string;
//     body: string;
//     channel?: NotificationChannel;
//     data?: any;
// }) {
//     const notification = await prisma.notification.create({
//         data: {
//             userId: data.userId,
//             senderId: data.senderId,
//             reportId: data.reportId,
//             type: data.type,
//             channel: data.channel || NotificationChannel.IN_APP,
//             title: data.title,
//             body: data.body,
//             data: data.data,
//             isRead: false,
//         },
//         include: {
//             report: { select: { caseNumber: true, title: true } },
//             sender: { select: { fullName: true } },
//         },
//     });

//     // Realtime: Emit to the specific officer's room
//     io.to(`user_${data.userId}`).emit("new-notification", notification);

//     return notification;
// }
export async function createNotification(data: {
    userId?: string; // Optional if notifying admins/role
    senderId?: string;
    reportId?: string;
    type: NotificationType;
    title: string;
    body: string;
    channel?: NotificationChannel;
    data?: any;
}) {
    // 1. Single User Notification (if userId provided)
    if (data.userId) {
        const notification = await prisma.notification.create({
            data: {
                userId: data.userId,
                senderId: data.senderId,
                reportId: data.reportId,
                type: data.type,
                channel: data.channel || NotificationChannel.IN_APP,
                title: data.title,
                body: data.body,
                data: data.data || {},
                isRead: false,
            },
            include: {
                report: { select: { caseNumber: true, title: true } },
                sender: { select: { fullName: true } },
            },
        });

        // 🔥 REAL-TIME EMIT
        io.to(`user_${data.userId}`).emit("new-notification", notification);
        return notification;
    }

    return null;
}

/**
 * Broadcast notification to all Admins and Super Admins
 */
export async function notifyAdmins(data: {
    senderId?: string;
    reportId?: string;
    type: NotificationType;
    title: string;
    body: string;
    data?: any;
}) {
    // 1. Fetch all admins
    const admins = await prisma.user.findMany({
        where: {
            role: {
                name: { in: ['ADMIN', 'SUPER_ADMIN'] }
            },
            status: 'ACTIVE'
        },
        select: { id: true }
    });

    if (admins.length === 0) return;

    // 2. Create notifications for each admin in parallel
    // We use a loop or Promise.all to trigger events for each (or could batch insert if no realtime needed per user)
    // For realtime consistency, let's just loop (shouldn't be too many admins)

    await Promise.all(admins.map(async (admin) => {
        await createNotification({
            userId: admin.id,
            ...data
        });
    }));
}
export async function getUserNotifications(userId: string) {
    return prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            report: { select: { caseNumber: true, title: true } },
            sender: { select: { fullName: true } },
        },
    });
}

export async function markAsRead(id: string, userId: string) {
    const notification = await prisma.notification.update({
        where: { id, userId },
        data: { isRead: true, readAt: new Date() },
    });

    // Optional: Emit update to sync across tabs/devices
    io.to(`user_${userId}`).emit("notification-read", { id });

    return notification;
}

export async function deleteNotification(id: string, userId: string) {
    // Ensure the notification belongs to the user
    const notification = await prisma.notification.delete({
        where: { id, userId },
    });

    return notification;
}