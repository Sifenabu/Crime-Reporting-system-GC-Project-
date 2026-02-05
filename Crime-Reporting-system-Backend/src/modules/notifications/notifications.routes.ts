// src/modules/notifications/notifications.routes.ts
import { Router } from "express";
import { getNotifications, markNotificationRead, deleteNotificationController } from "./notifications.controller";
import { authMiddleware, AuthRequest, requireRole } from "../../middlewares/auth.middleware"; // ← ADD THIS
import { createNotification } from "./notifications.service";
import { NotificationType } from "@prisma/client";

const router = Router();

// Apply auth to all routes
router.use(authMiddleware);

// Test route to see if auth works
router.get("/me", (req: any, res) => {
    res.json({
        message: "Auth working!",
        user: req.user,
    });
});

router.get("/", getNotifications);
router.patch("/:id/read", markNotificationRead);
router.delete("/:id", deleteNotificationController);

// TEMPORARY TEST — remove later
// router.post("/test", authMiddleware, async (req: AuthRequest, res) => {
//     await createNotification({
//         userId: req.user!.sub,
//         type: "CASE_ASSIGNED",
//         title: "Test Notification",
//         body: "This is a test from Postman! Realtime should work too.",
//     });
//     res.json({ success: true, message: "Test notification created" });
// });
// Optional: restrict to SUPER_ADMIN only
router.post("/test", authMiddleware, requireRole(["SUPER_ADMIN"]), async (req: AuthRequest, res) => {
    await createNotification({
        userId: req.user!.sub,
        type: NotificationType.CASE_ASSIGNED,
        title: "Test Notification",
        body: "This is a test from Postman! Realtime should work too.",
    });
    res.json({ success: true, message: "Test notification created" });
});

export default router;