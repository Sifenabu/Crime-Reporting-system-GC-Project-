// src/modules/contact/contact.routes.ts
import { Router } from "express";
import * as ctrl from "./contact.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Public route for everyone
router.post("/", ctrl.submitContactController);

// Protected routes (Admin/Staff only)
router.get("/", authMiddleware, ctrl.listContactsController);
router.get("/:id", authMiddleware, ctrl.getContactController);
router.patch("/:id", authMiddleware, ctrl.updateContactController);
router.post("/:id/reply", authMiddleware, ctrl.replyContactController);
router.delete("/:id", authMiddleware, ctrl.deleteContactController);

export default router;