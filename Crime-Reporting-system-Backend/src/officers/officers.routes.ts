// src/modules/officers/officers.routes.ts
import { Router } from "express";
import { create, list, get, update, remove, getOnDuty } from "./officers.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

// Full CRUD for officers (admin only)
router.post("/", authMiddleware, requireRole(["ADMIN", "SUPER_ADMIN"]), create); // POST /api/officers
router.get("/on-duty", authMiddleware, requireRole(["ADMIN", "OPERATOR", "SUPER_ADMIN"]), getOnDuty);
router.get("/", authMiddleware, requireRole(["ADMIN", "SUPER_ADMIN"]), list); // GET /api/officers
router.get("/:id", authMiddleware, get); // GET /api/officers/:id
router.patch("/:id", authMiddleware, requireRole(["ADMIN", "SUPER_ADMIN"]), update); // PATCH /api/officers/:id
router.delete("/:id", authMiddleware, requireRole(["ADMIN", "SUPER_ADMIN"]), remove); // DELETE /api/officers/:id
export default router;