// src/modules/notices/notices.routes.ts
import { Router } from "express";
import { create, list, get, update, remove } from "./notices.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, requireRole(["SUPER_ADMIN", "ADMIN", "OPERATOR"]), create); // POST /api/notices
router.get("/", list); // GET /api/notices (public if published)
router.get("/:id", get); // GET /api/notices/:id
router.patch("/:id", authMiddleware, requireRole(["SUPER_ADMIN", "ADMIN", "OPERATOR"]), update); // PATCH /api/notices/:id
router.delete("/:id", authMiddleware, requireRole(["SUPER_ADMIN", "ADMIN"]), remove); // DELETE /api/notices/:id

export default router;