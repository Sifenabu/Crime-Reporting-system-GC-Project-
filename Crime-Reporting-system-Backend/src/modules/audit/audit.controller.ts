// src/modules/audit/audit.controller.ts
import { Request, Response } from "express";
import { prisma } from "../../config/db";

export async function getAuditLogs(req: Request, res: Response) {
    // Add role check later
    const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
    });
    res.json({ success: true, logs });
}