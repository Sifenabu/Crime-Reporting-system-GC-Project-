// src/routes/index.ts
import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import blogRoutes from "../modules/blog/blog.routes";
import contactRoutes from "../modules/contact/contact.routes";
import health from "./health";
import reportRoutes from "../modules/reports/reports.routes";
import assignmentRoutes from "../modules/assignments/assignments.routes";
import officerRoutes from "../modules/officers/officers.routes";
import auditRoutes from "../modules/audit/audit.routes";
import notificationsRoutes from "../modules/notifications/notifications.routes";
import noticesRoutes from "../modules/notices/notices.routes";
import aiRoutes from "../modules/ai/ai.routes"; // ← Correct: default import (no {})

const router = Router();

router.use("/health", health);
router.use("/auth", authRoutes);
router.use("/reports", reportRoutes);
router.use("/blog", blogRoutes);
router.use("/contact", contactRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/officers", officerRoutes);
router.use("/audit", auditRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/notices", noticesRoutes);
router.use("/ai", aiRoutes); // ← Now works

// Remove this test route — it's incorrectly placed (causes /api/test)
// router.get("/test", (req, res) => {
//     res.json({ message: "Contact route working!", data: "hello" });
// });

export default router;