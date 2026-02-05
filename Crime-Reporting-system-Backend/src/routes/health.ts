import { Router } from "express";
import { prisma } from "../config/db";
const router = Router();
router.get("/", async (req, res) => {
    try { await prisma.$queryRaw`SELECT 1`; res.json({ status: "ok" }); }
    catch (err) { res.status(500).json({ status: "error", message: String(err) }); }
});
export default router;
