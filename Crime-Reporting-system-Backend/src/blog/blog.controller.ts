import { Request, Response } from "express";
import {
    createBlogPost,
    getPublishedPosts,
    getPostDetail,
    updateBlogPost,
    deleteBlogPost,
    approveBlogComment,
} from "./blog.service";
import cloudinary from "../../config/cloudinary";
import { uploadMiddleware } from "../../middlewares/upload.middleware";
import streamifier from "streamifier";
import { prisma } from "../../config/db";

interface AuthRequest extends Request {
    user?: { sub: string; role: string };
}

// Multer fields: cover + multiple media
const uploadFields = uploadMiddleware.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "media", maxCount: 10 }, // up to 10 images/videos
]);

export async function createPost(req: AuthRequest, res: Response) {
    uploadFields(req, res, async (err) => {
        if (err) return res.status(400).json({ success: false, error: err.message });

        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const coverFile = files?.coverImage?.[0];
            const mediaFiles = files?.media || [];

            let coverImageUrl: string | undefined;
            let coverImagePublicId: string | undefined;
            const mediaData: any[] = [];

            // Upload cover
            if (coverFile) {
                const result = await uploadToCloudinary(coverFile.buffer, coverFile.mimetype, "blog-covers");
                coverImageUrl = result.secure_url;
                coverImagePublicId = result.public_id;
            }

            // Upload media
            for (let i = 0; i < mediaFiles.length; i++) {
                const file = mediaFiles[i];
                const caption = req.body[`mediaCaption${i}`] || "";
                const result = await uploadToCloudinary(file.buffer, file.mimetype, "blog-media");
                mediaData.push({
                    type: file.mimetype.startsWith("video") ? "VIDEO" : "IMAGE",
                    url: result.secure_url,
                    publicId: result.public_id,
                    caption,
                    format: file.mimetype.split("/")[1],
                    sizeBytes: file.size,
                });
            }

            const post = await createBlogPost({
                ...req.body,
                authorId: req.user!.sub,
                coverImageUrl,
                coverImagePublicId,
                media: mediaData,
                tagIds: req.body.tagIds ? JSON.parse(req.body.tagIds) : undefined,
            });

            res.status(201).json({ success: true, post });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
}

export async function getPosts(req: AuthRequest, res: Response) {
    const { crimeTypeId, locationId, categoryId, tagId, search } = req.query;
    const posts = await getPublishedPosts({
        crimeTypeId: crimeTypeId ? Number(crimeTypeId) : undefined,
        locationId: locationId ? Number(locationId) : undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        tagId: tagId ? Number(tagId) : undefined,
        search: search as string,
    });
    res.json({ success: true, posts });
}

export async function getPostById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const post = await getPostDetail(id);
    if (!post) return res.status(404).json({ success: false, error: "Post not found" });

    // Increment views
    // await prisma.blogPost.update({
    //     where: { id },
    //     data: { views: { increment: 1 } },
    // });

    res.json({ success: true, post });
}

export async function updatePost(req: AuthRequest, res: Response) {
    uploadFields(req, res, async (err) => {
        if (err) return res.status(400).json({ success: false, error: err.message });

        try {
            const { id } = req.params;
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const coverFile = files?.coverImage?.[0];
            const mediaFiles = files?.media || [];

            let coverImageUrl: string | undefined;
            let coverImagePublicId: string | undefined;
            const newMedia: any[] = [];

            // Handle new cover
            if (coverFile) {
                const current = await prisma.blogPost.findUnique({ where: { id } });
                if (current?.coverImagePublicId) {
                    await cloudinary.uploader.destroy(current.coverImagePublicId);
                }
                const result = await uploadToCloudinary(coverFile.buffer, coverFile.mimetype, "blog-covers");
                coverImageUrl = result.secure_url;
                coverImagePublicId = result.public_id;
            }

            // Handle new media
            for (let i = 0; i < mediaFiles.length; i++) {
                const file = mediaFiles[i];
                const caption = req.body[`mediaCaption${i}`] || "";
                const result = await uploadToCloudinary(file.buffer, file.mimetype, "blog-media");
                newMedia.push({
                    type: file.mimetype.startsWith("video") ? "VIDEO" : "IMAGE",
                    url: result.secure_url,
                    publicId: result.public_id,
                    caption,
                    format: file.mimetype.split("/")[1],
                    sizeBytes: file.size,
                });
            }

            const { views, ...bodyWithoutViews } = req.body;

            const updated = await updateBlogPost(id, {
                ...bodyWithoutViews,
                coverImageUrl,
                coverImagePublicId,
                newMedia,
                tagIds: req.body.tagIds ? JSON.parse(req.body.tagIds) : undefined,
            });

            res.json({ success: true, post: updated });
        } catch (error: any) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
}

export async function deletePost(req: AuthRequest, res: Response) {
    const { id } = req.params;
    await deleteBlogPost(id);
    res.json({ success: true, message: "Post deleted successfully" });
}

export async function approveComment(req: AuthRequest, res: Response) {
    const { commentId } = req.params;
    const comment = await approveBlogComment(commentId, req.user!.sub);
    res.json({ success: true, comment });
}

// Helper
async function uploadToCloudinary(buffer: Buffer, mimetype: string, folder: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: mimetype.startsWith("video") ? "video" : "image",
            },
            (error, result: any) => (error ? reject(error) : resolve(result!))
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
}