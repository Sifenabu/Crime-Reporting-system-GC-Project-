// reports/reports.routes.ts
import { Router } from "express";
import { createReport, deleteReport, getReports, getSingleReport, updateReport, updateReportPriorityController } from "./reports.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
const router = Router();
router.post("/", createReport);
router.get("/", authMiddleware, getReports);                  // GET /api/reports
router.patch("/:id/priority", authMiddleware, updateReportPriorityController); // PATCH priority (must be before /:id)
router.get("/:id", authMiddleware, getSingleReport);          // GET /api/reports/cmj...
router.patch("/:id", authMiddleware, updateReport);           // PATCH status, assignment
router.delete("/:id", authMiddleware, deleteReport);          // DELETE (admin only)
export default router;
