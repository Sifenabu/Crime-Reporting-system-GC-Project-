// src/modules/notifications/notifications.controller.ts
import { Request, Response } from "express";
import { getUserNotifications, markAsRead } from "./notifications.service";
import { prisma } from "../../config/db";

interface AuthRequest extends Request {
    user?: { sub: string };
}

// export async function getNotifications(req: AuthRequest, res: Response) {
//     if (!req.user) return res.status(401).json({ error: "Unauthorized" });
//     const notifications = await getUserNotifications(req.user.sub);
//     res.json({ success: true, notifications });
// }
// src/modules/notifications/notifications.controller.ts
// src/modules/notifications/notifications.controller.ts
export async function getNotifications(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const userId = req.user.sub;
    const { page = 1, limit = 20, unreadOnly = false, type } = req.query;

    try {
        const where: any = {
            userId,
            ...(unreadOnly === 'true' ? { isRead: false } : {}),
            ...(type && type !== 'all' ? { type } : {}),
        };

        const [notifications, total, unreadCount] = await Promise.all([
            prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: Number(limit),
                skip: (Number(page) - 1) * Number(limit),
                include: {
                    report: { select: { caseNumber: true, title: true } },
                    sender: { select: { fullName: true } },
                },
            }),
            prisma.notification.count({ where }),
            prisma.notification.count({ where: { userId, isRead: false } }),
        ]);

        res.json({
            success: true,
            notifications,
            unreadCount, // ← NEW: total unread
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
}

export async function deleteNotificationController(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    try {
        const { id } = req.params;
        const userId = req.user.sub;

        await import("./notifications.service").then(s => s.deleteNotification(id, userId));

        res.json({ success: true, message: "Notification deleted" });
    } catch (error) {
        console.error("Delete notification error:", error);
        res.status(500).json({ error: "Failed to delete notification" });
    }
}

// export async function markNotificationRead(req: AuthRequest, res: Response) {
//     if (!req.user) return res.status(401).json({ error: "Unauthorized" });
//     const { id } = req.params;
//     await markAsRead(id, req.user.sub);
//     res.json({ success: true });
// }

export async function markNotificationRead(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const userId = req.user.sub;

    try {
        if (id === "all") {
            // Bulk update for the current user
            await prisma.notification.updateMany({
                where: { userId, isRead: false },
                data: { isRead: true, readAt: new Date() },
            });
            return res.json({ success: true, message: "All notifications marked as read" });
        }

        // Single update
        await markAsRead(id, userId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to update notification status" });
    }
}