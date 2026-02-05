import { prisma } from "../../config/db";
import { NoticeType, NotificationType } from "@prisma/client";
import cloudinary from "../../config/cloudinary";

export async function createNotice(data: {
    title: string;
    content: string;
    description?: string | null;
    type: NoticeType;
    locationId?: number;
    imageUrl?: string;
    imagePublicId?: string;
    isPublished?: boolean;
    createdById: string;
}) {
    const notice = await prisma.notice.create({
        data: {
            title: data.title,
            content: data.content,
            description: data.description || null, // explicitly handle empty strings
            type: data.type,
            locationId: data.locationId,
            imageUrl: data.imageUrl,
            imagePublicId: data.imagePublicId,
            severity: "MEDIUM", // default if not sent
            isPublished: data.isPublished ?? true,
            createdById: data.createdById,
        },
        include: {
            location: {
                select: { id: true, city: true, subCity: true, kebele: true, lat: true, lng: true },
            },
            createdBy: {
                select: { id: true, fullName: true, email: true },
            },
        },
    });

    if (data.isPublished) {
        const citizens = await prisma.user.findMany({
            where: { role: { name: "CITIZEN" } },
        });

        if (citizens.length > 0) {
            await prisma.notification.createMany({
                data: citizens.map(user => ({
                    userId: user.id,
                    type: NotificationType.NOTICE_PUBLISHED,
                    title: "New Public Notice",
                    body: `New ${data.type} notice: ${data.title}`,
                    channel: "IN_APP",
                })),
            });
        }
    }

    return notice;
}

export async function getNotices(publishedOnly = true) {
    return prisma.notice.findMany({
        where: publishedOnly ? { isPublished: true } : undefined,
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            content: true,
            description: true,
            type: true,
            imageUrl: true,
            imagePublicId: true,
            severity: true,
            isPublished: true,
            createdAt: true,
            updatedAt: true,
            location: {
                select: { id: true, city: true, subCity: true, kebele: true, lat: true, lng: true },
            },
            createdBy: {
                select: { id: true, fullName: true, email: true },
            },
        },
    });
}

export async function getNotice(id: string) {
    return prisma.notice.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            content: true,
            description: true,
            type: true,
            imageUrl: true,
            imagePublicId: true,
            severity: true,
            isPublished: true,
            createdAt: true,
            updatedAt: true,
            location: {
                select: { id: true, city: true, subCity: true, kebele: true, lat: true, lng: true },
            },
            createdBy: {
                select: { id: true, fullName: true, email: true },
            },
        },
    });
}

export async function updateNotice(id: string, data: Partial<{
    title: string;
    content: string;
    description?: string;
    type: NoticeType;
    locationId?: number;
    imageUrl?: string;
    imagePublicId?: string;
    isPublished?: boolean;
}>) {
    return prisma.notice.update({
        where: { id },
        data,
    });
}

export async function deleteNotice(id: string) {
    const notice = await prisma.notice.findUnique({ where: { id } });

    if (notice?.imagePublicId) {
        await cloudinary.uploader.destroy(notice.imagePublicId);
    }

    await prisma.notice.delete({ where: { id } });

    return { success: true };
}
