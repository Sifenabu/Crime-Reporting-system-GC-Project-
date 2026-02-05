import { Router } from "express";
import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    approveComment,
} from "./blog.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";
import { prisma } from "../../config/db";

const router = Router();

// Public routes
// Add these to your router
router.get("/categories", async (req, res) => {
    const categories = await prisma.blogCategory.findMany();
    res.json({ success: true, categories });
});

router.get("/crime-types", async (req, res) => {
    const types = await prisma.crimeType.findMany();
    res.json({ success: true, crimeTypes: types });
});

router.get("/locations", async (req, res) => {
    const locations = await prisma.location.findMany();
    res.json({ success: true, locations });
});
router.get("/", getPosts);                    // GET /api/blog - list published posts
router.get("/:id", getPostById);              // GET /api/blog/:id - single post

// Admin/Operator routes
router.post("/", authMiddleware, requireRole(["ADMIN", "OPERATOR", "SUPER_ADMIN"]), createPost);
router.patch("/:id", authMiddleware, requireRole(["ADMIN", "OPERATOR", "SUPER_ADMIN"]), updatePost);
router.delete("/:id", authMiddleware, requireRole(["ADMIN", "SUPER_ADMIN"]), deletePost);

// Comment moderation
router.patch("/comments/:commentId/approve", authMiddleware, requireRole(["ADMIN", "OPERATOR", "SUPER_ADMIN"]), approveComment);

export default router;