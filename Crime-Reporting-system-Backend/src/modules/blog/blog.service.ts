import { prisma } from "../../config/db";
import cloudinary from "../../config/cloudinary";
import { BlogPostStatus } from "@prisma/client";

const slugify = (text: string) =>
    text.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

// Helper: validate foreign key existence
async function validateForeignKey(table: string, id: number | string | undefined, fieldName: string) {
    if (id === undefined || id === null) return;
    let exists = false;

    switch (table) {
        case "BlogCategory":
            exists = !!(await prisma.blogCategory.findUnique({ where: { id: Number(id) } }));
            break;
        case "CrimeType":
            exists = !!(await prisma.crimeType.findUnique({ where: { id: Number(id) } }));
            break;
        case "Location":
            exists = !!(await prisma.location.findUnique({ where: { id: Number(id) } }));
            break;
        case "Report":
            exists = !!(await prisma.report.findUnique({ where: { id: String(id) } }));
            break;
        case "User":
            exists = !!(await prisma.user.findUnique({ where: { id: String(id) } }));
            break;
        case "BlogTag":
            exists = !!(await prisma.blogTag.findUnique({ where: { id: Number(id) } }));
            break;
        default:
            throw new Error(`Unknown table for FK validation: ${table}`);
    }

    if (!exists) throw new Error(`Foreign key constraint failed: ${fieldName}=${id} does not exist`);
}

export async function createBlogPost(data: {
    title: string;
    summary?: string;
    content: string;
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    crimeTypeId?: number | string;
    locationId?: number | string;
    relatedReportId?: string;
    isPublic?: boolean | string;
    isPinned?: boolean | string;
    categoryId?: number | string;
    tagIds?: number[] | string[];
    authorId: string;
    coverImageUrl?: string;
    coverImagePublicId?: string;
    media: any[];
}) {
    // Validate foreign keys first
    await validateForeignKey("User", data.authorId, "authorId");
    await validateForeignKey("BlogCategory", data.categoryId, "categoryId");
    await validateForeignKey("CrimeType", data.crimeTypeId, "crimeTypeId");
    await validateForeignKey("Location", data.locationId, "locationId");
    await validateForeignKey("Report", data.relatedReportId, "relatedReportId");
    if (data.tagIds) {
        for (const tagId of data.tagIds) {
            await validateForeignKey("BlogTag", tagId, "tagId");
        }
    }

    return prisma.blogPost.create({
        data: {
            title: data.title,
            slug: slugify(data.title),
            summary: data.summary,
            content: data.content,
            status: (data.status || "DRAFT") as BlogPostStatus,
            crimeTypeId: data.crimeTypeId ? Number(data.crimeTypeId) : undefined,
            locationId: data.locationId ? Number(data.locationId) : undefined,
            relatedReportId: data.relatedReportId || null,
            isPublic: data.isPublic !== undefined ? (data.isPublic === true || data.isPublic === "true") : true,
            isPinned: data.isPinned !== undefined ? (data.isPinned === true || data.isPinned === "true") : false,
            coverImageUrl: data.coverImageUrl,
            coverImagePublicId: data.coverImagePublicId,
            authorId: data.authorId,
            categoryId: data.categoryId ? Number(data.categoryId) : undefined,
            publishedAt: data.status === "PUBLISHED" ? new Date() : undefined,
            tags: data.tagIds ? { create: data.tagIds.map((id) => ({ tagId: Number(id) })) } : undefined,
            media: { create: data.media },
        },
        include: {
            author: { select: { fullName: true, email: true } },
            category: true,
            crimeType: true,
            location: true,
            relatedReport: { select: { title: true, caseNumber: true } },
            tags: { include: { tag: true } },
            media: true,
            comments: { where: { isApproved: true } },
        },
    });
}

export async function updateBlogPost(id: string, data: any) {
    // Validate foreign keys
    if (data.authorId) await validateForeignKey("User", data.authorId, "authorId");
    if (data.categoryId) await validateForeignKey("BlogCategory", data.categoryId, "categoryId");
    if (data.crimeTypeId) await validateForeignKey("CrimeType", data.crimeTypeId, "crimeTypeId");
    if (data.locationId) await validateForeignKey("Location", data.locationId, "locationId");
    if (data.relatedReportId) await validateForeignKey("Report", data.relatedReportId, "relatedReportId");
    if (data.tagIds) {
        for (const tagId of data.tagIds) {
            await validateForeignKey("BlogTag", tagId, "tagId");
        }
    }

    const updateData: any = {
        title: data.title,
        slug: data.title ? slugify(data.title) : undefined,
        summary: data.summary,
        content: data.content,
        status: data.status as BlogPostStatus | undefined,
        crimeTypeId: data.crimeTypeId ? Number(data.crimeTypeId) || null : undefined,
        locationId: data.locationId ? Number(data.locationId) || null : undefined,
        relatedReportId: data.relatedReportId || null,
        isPublic: data.isPublic !== undefined ? (data.isPublic === true || data.isPublic === "true") : undefined,
        isPinned: data.isPinned !== undefined ? (data.isPinned === true || data.isPinned === "true") : undefined,
        categoryId: data.categoryId ? Number(data.categoryId) || null : undefined,
        coverImageUrl: data.coverImageUrl,
        coverImagePublicId: data.coverImagePublicId,
        publishedAt: data.status === "PUBLISHED" ? new Date() : undefined,
    };

    if (data.tagIds) {
        await prisma.blogPostTag.deleteMany({ where: { postId: id } });
        updateData.tags = { create: data.tagIds.map((tagId: number | string) => ({ tagId: Number(tagId) })) };
    }

    if (data.newMedia && data.newMedia.length > 0) {
        updateData.media = { create: data.newMedia };
    }

    return prisma.blogPost.update({
        where: { id },
        data: updateData,
        include: {
            author: { select: { fullName: true } },
            category: true,
            crimeType: true,
            location: true,
            tags: { include: { tag: true } },
            media: true,
            comments: true,
        },
    });
}

export async function getPublishedPosts(filters: {
    crimeTypeId?: number | string;
    locationId?: number | string;
    categoryId?: number | string;
    tagId?: number | string;
    search?: string;
}) {
    return prisma.blogPost.findMany({
        where: {
            status: "PUBLISHED",
            isPublic: true,
            ...(filters.crimeTypeId && { crimeTypeId: Number(filters.crimeTypeId) }),
            ...(filters.locationId && { locationId: Number(filters.locationId) }),
            ...(filters.categoryId && { categoryId: Number(filters.categoryId) }),
            ...(filters.tagId && { tags: { some: { tagId: Number(filters.tagId) } } }),
            ...(filters.search && {
                OR: [
                    { title: { contains: filters.search, mode: "insensitive" } },
                    { summary: { contains: filters.search, mode: "insensitive" } },
                    { content: { contains: filters.search, mode: "insensitive" } },
                ],
            }),
        },
        orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
        include: {
            author: { select: { fullName: true } },
            category: true,
            crimeType: true,
            location: true,
            tags: { include: { tag: true } },
            media: { orderBy: { createdAt: "asc" } },
            comments: { where: { isApproved: true } },
            _count: { select: { comments: true } },
        },
    });
}

export async function getPostDetail(id: string) {
    return prisma.blogPost.findUnique({
        where: { id },
        include: {
            author: { select: { fullName: true } },
            category: true,
            crimeType: true,
            location: true,
            relatedReport: { select: { title: true, caseNumber: true } },
            tags: { include: { tag: true } },
            media: { orderBy: { createdAt: "asc" } },
            comments: {
                where: { isApproved: true },
                include: { approvedBy: { select: { fullName: true } } },
            },
            _count: { select: { comments: true } },
        },
    });
}

// export async function deleteBlogPost(id: string) {
//     const post = await prisma.blogPost.findUnique({
//         where: { id },
//         include: { media: true },
//     });

//     if (post) {
//         if (post.coverImagePublicId) await cloudinary.uploader.destroy(post.coverImagePublicId);
//         for (const m of post.media) {
//             if (m.publicId) await cloudinary.uploader.destroy(m.publicId);
//         }

//         await prisma.blogPost.delete({ where: { id } });
//     }
// }

export async function deleteBlogPost(id: string) {
    const post = await prisma.blogPost.findUnique({
        where: { id },
        include: { media: true },
    });

    if (post) {
        // 1. Delete Cover Image from Cloudinary
        if (post.coverImagePublicId) {
            await cloudinary.uploader.destroy(post.coverImagePublicId).catch(() => null);
        }

        // 2. Delete Gallery Media from Cloudinary
        for (const m of post.media) {
            if (m.publicId) {
                await cloudinary.uploader.destroy(m.publicId).catch(() => null);
            }
        }

        // 3. IMPORTANT: Delete associated media records from DB first
        await prisma.blogMedia.deleteMany({
            where: { blogPostId: id }
        });

        // 4. IMPORTANT: If you have Tags/Comments, delete them or ensure Cascade Delete is on
        // await prisma.blogComment.deleteMany({ where: { blogPostId: id } });

        // 5. Now delete the post
        return await prisma.blogPost.delete({ where: { id } });
    }
}

export async function approveBlogComment(commentId: string, approvedById: string) {
    return prisma.blogComment.update({
        where: { id: commentId },
        data: { isApproved: true, approvedById },
    });
}
