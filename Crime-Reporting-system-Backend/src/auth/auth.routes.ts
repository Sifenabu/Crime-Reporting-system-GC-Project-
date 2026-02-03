// src/modules/auth/auth.routes.ts
import { Router } from "express";
import { loginController, registerController, meController } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
const router = Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.get("/me", authMiddleware, meController);

export default router;
