// src/modules/notices/notices.controller.ts
import { Request, Response } from "express";
import {
    createNotice,
    getNotices,
    getNotice,
    updateNotice,
    deleteNotice,
} from "./notices.service";
import cloudinary from "../../config/cloudinary";
import { uploadNotice } from "../../middlewares/upload.middleware";
import streamifier from "streamifier";

interface AuthRequest extends Request {
    user?: { sub: string; role: string };
}

export async function create(req: AuthRequest, res: Response) {
    uploadNotice(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, error: err.message || "File upload failed" });
        }

        try {
            if (!req.user || !["ADMIN", "OPERATOR", "SUPER_ADMIN"].includes(req.user.role)) {
                return res.status(403).json({ success: false, error: "Unauthorized" });
            }

            let imageUrl: string | undefined;
            let imagePublicId: string | undefined;

            if (req.file) {
                console.log("Uploading file to Cloudinary:", req.file.originalname);

                const result: any = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: "adama-notices",
                            resource_type: req.file!.mimetype.startsWith("video") ? "video" : "image",
                        },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                        }
                    );

                    streamifier.createReadStream(req.file!.buffer).pipe(uploadStream);
                });

                imageUrl = result.secure_url;
                imagePublicId = result.public_id;

                console.log("Upload successful:", imageUrl);
            }

            // Debug incoming body
            console.log("Request body:", req.body);

            const notice = await createNotice({
                title: req.body.title?.trim(),
                content: req.body.content?.trim(),
                description: req.body.description?.trim() || null, // handles empty string
                type: req.body.type as any,
                locationId: req.body.locationId ? Number(req.body.locationId) : undefined,
                imageUrl,
                imagePublicId,
                isPublished: req.body.isPublished === "true" || req.body.isPublished === true,
                createdById: req.user.sub,
            });

            res.status(201).json({ success: true, notice });
        } catch (error: any) {
            console.error("Create notice error:", error);
            res.status(500).json({ success: false, error: error.message || "Failed to create notice" });
        }
    });
}

export async function list(req: AuthRequest, res: Response) {
    const notices = await getNotices(req.user?.role !== "ADMIN" && req.user?.role !== "SUPER_ADMIN");
    res.json({ success: true, notices });
}

export async function get(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const notice = await getNotice(id);
    if (!notice) return res.status(404).json({ success: false, error: "Notice not found" });
    res.json({ success: true, notice });
}

export async function update(req: AuthRequest, res: Response) {
    if (!req.user || !["ADMIN", "OPERATOR", "SUPER_ADMIN"].includes(req.user.role)) {
        return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    const { id } = req.params;
    const updated = await updateNotice(id, req.body);
    res.json({ success: true, notice: updated });
}

// src/modules/notices/notices.controller.ts
// export async function update(req: AuthRequest, res: Response) {
//     if (!req.user || !["ADMIN", "OPERATOR", "SUPER_ADMIN"].includes(req.user.role)) {
//         return res.status(403).json({ success: false, error: "Unauthorized" });
//     }

//     const { id } = req.params;

//     try {
//         // Use the same upload middleware callback pattern as create
//         uploadNotice(req, res, async (err) => {
//             if (err) {
//                 return res.status(400).json({ success: false, error: err.message });
//             }

//             let imageUrl: string | undefined;
//             let imagePublicId: string | undefined;

//             // Handle new image upload (optional)
//             if (req.file) {
//                 console.log("Uploading new image to Cloudinary:", req.file.originalname);

//                 const result: any = await new Promise((resolve, reject) => {
//                     const uploadStream = cloudinary.uploader.upload_stream(
//                         {
//                             folder: "adama-notices",
//                             resource_type: req.file!.mimetype.startsWith("video") ? "video" : "image",
//                         },
//                         (error, result) => {
//                             if (error) return reject(error);
//                             resolve(result);
//                         }
//                     );
//                     streamifier.createReadStream(req.file!.buffer).pipe(uploadStream);
//                 });

//                 imageUrl = result.secure_url;
//                 imagePublicId = result.public_id;

//                 // Optional: Delete old image if exists
//                 const oldNotice = await getNotice(id);
//                 if (oldNotice?.imagePublicId) {
//                     await cloudinary.uploader.destroy(oldNotice.imagePublicId);
//                 }
//             }

//             console.log("Update req.body:", req.body); // Debug

//             const updatedData: any = {
//                 title: req.body.title?.trim(),
//                 content: req.body.content?.trim(),
//                 description: req.body.description?.trim() || null,
//                 type: req.body.type as any,
//                 severity: req.body.severity as any, // ← You send severity from frontend
//                 isPublished: req.body.isPublished === "true" || req.body.isPublished === true,
//             };

//             if (imageUrl) updatedData.imageUrl = imageUrl;
//             if (imagePublicId) updatedData.imagePublicId = imagePublicId;

//             const updated = await updateNotice(id, updatedData);

//             res.json({ success: true, notice: updated });
//         });
//     } catch (error: any) {
//         console.error("Update error:", error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

export async function remove(req: AuthRequest, res: Response) {
    if (!req.user || !["ADMIN", "SUPER_ADMIN"].includes(req.user.role)) {
        return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    const { id } = req.params;
    await deleteNotice(id);
    res.json({ success: true, message: "Notice deleted" });
}