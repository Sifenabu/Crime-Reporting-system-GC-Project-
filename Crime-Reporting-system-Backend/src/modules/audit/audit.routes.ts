// src/modules/audit/audit.routes.ts
import { Router } from "express";
import { getAuditLogs } from "./audit.controller";

const router = Router();

router.get("/", getAuditLogs); // GET /api/audit

export default router;