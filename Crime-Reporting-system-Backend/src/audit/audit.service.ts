// src/modules/audit/audit.service.ts
import { prisma } from "../../config/db";

export async function logAudit(data: {
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    ipAddress?: string;
    userAgent?: string;
    data?: any;
}) {
    await prisma.auditLog.create({
        data: {
            userId: data.userId,
            action: data.action,
            entity: data.entity,
            entityId: data.entityId,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            data: data.data,
        },
    });
}