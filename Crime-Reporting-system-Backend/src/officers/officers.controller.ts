// src/modules/officers/officers.controller.ts
import { Request, Response } from "express";
import {
    createOfficer,
    getOfficers,
    getOfficer,
    updateOfficer,
    deleteOfficer,
    getOnDutyOfficers
} from "./officers.service";
import cloudinary from "../../config/cloudinary";
import { uploadProfileImage } from "../../middlewares/upload.middleware";
import streamifier from "streamifier";
import { prisma } from "../../config/db";
import { } from "./officers.service";

interface AuthRequest extends Request {
    user?: { sub: string; role: string };
}

export async function create(req: AuthRequest, res: Response) {
    uploadProfileImage(req, res, async (err) => {
        if (err) return res.status(400).json({ success: false, error: err.message });

        try {
            if (!req.user || !["ADMIN", "SUPER_ADMIN"].includes(req.user.role))
                throw new Error("Unauthorized");

            let profileImage: string | undefined;
            let profileImagePublicId: string | undefined;

            if (req.file) {
                const result: any = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "adama-officers", resource_type: "image" },
                        (error, result) => (error ? reject(error) : resolve(result))
                    );
                    streamifier.createReadStream(req.file!.buffer).pipe(uploadStream);
                });
                profileImage = result.secure_url;
                profileImagePublicId = result.public_id;
            }

            const officer = await createOfficer({
                ...req.body,
                profileImage,
                profileImagePublicId,
                createdById: req.user.sub,
            });

            res.status(201).json({ success: true, officer });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    });
}

export async function list(req: AuthRequest, res: Response) {
    try {
        if (!req.user || !["ADMIN", "SUPER_ADMIN"].includes(req.user.role))
            throw new Error("Unauthorized");

        const officers = await getOfficers();
        res.json({ success: true, officers });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
}

export async function get(req: AuthRequest, res: Response) {
    try {
        if (!req.user) throw new Error("Unauthorized");
        const { id } = req.params;
        const officer = await getOfficer(id);
        res.json({ success: true, officer });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
}

export async function update(req: AuthRequest, res: Response) {
    uploadProfileImage(req, res, async (err) => {
        if (err) return res.status(400).json({ success: false, error: err.message });

        try {
            if (!req.user || !["ADMIN", "SUPER_ADMIN"].includes(req.user.role))
                throw new Error("Unauthorized");

            const { id } = req.params;

            let profileImage: string | undefined;
            let profileImagePublicId: string | undefined;

            if (req.file) {
                // Delete old image if exists
                const currentBrand = await prisma.officerBrand.findUnique({ where: { officerId: id } });
                if (currentBrand?.profileImagePublicId) {
                    await cloudinary.uploader.destroy(currentBrand.profileImagePublicId);
                }

                const result: any = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "adama-officers", resource_type: "image" },
                        (error, result) => (error ? reject(error) : resolve(result))
                    );
                    streamifier.createReadStream(req.file!.buffer).pipe(uploadStream);
                });
                profileImage = result.secure_url;
                profileImagePublicId = result.public_id;
            }

            const updated = await updateOfficer(id, {
                ...req.body,
                profileImage,
                profileImagePublicId,
                updatedById: req.user.sub,
            });

            res.json({ success: true, officer: updated });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    });
}

export async function remove(req: AuthRequest, res: Response) {
    try {
        if (!req.user || !["ADMIN", "SUPER_ADMIN"].includes(req.user.role))
            throw new Error("Unauthorized");

        const { id } = req.params;

        // Delete profile image
        const brand = await prisma.officerBrand.findUnique({ where: { officerId: id } });
        if (brand?.profileImagePublicId) {
            await cloudinary.uploader.destroy(brand.profileImagePublicId);
        }

        await deleteOfficer(id);
        res.json({ success: true, message: "Officer deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
}

// Example in officers.controller.ts
// export async function getOnDutyOfficers(req: AuthRequest, res: Response) {
//     try {
//         if (!req.user) throw new Error("Unauthorized");
//         const officers = await prisma.officerProfile.findMany({
//             where: { availability: "ON_DUTY" },
//             select: {
//                 id: true,
//                 activeCaseCount: true,
//                 user: {
//                     select: { fullName: true },
//                 },
//                 reputation: {
//                     select: { rating: true },
//                 },
//             },
//         });

//         res.json({ success: true, officers });
//     } catch (error: any) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// }
export async function getOnDuty(req: Request, res: Response) {
    console.log("[DEBUG] getOnDuty endpoint hit!"); // ← Add this

    try {
        const officers = await getOnDutyOfficers();
        console.log("[DEBUG] Officers found:", officers.length); // ← Add this

        res.json({
            success: true,
            officers,
            count: officers.length,
        });
    } catch (error: any) {
        console.error("[ERROR] getOnDuty failed:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch on-duty officers",
        });
    }
}

// await prisma.officerProfile.update({
//     where: { id: "cmj63ihk20002tz7waccghqiv" }, // ← replace with real ID
//     data: { activeCaseCount: 0 },
// });

// // src/modules/officers/officers.controller.ts
// import { Request, Response } from "express";
// import {
//     createOfficer,
//     getOfficers,
//     getOfficer,
//     updateOfficer,
//     deleteOfficer
// } from "./officers.service";

// interface AuthRequest extends Request {
//     user?: { sub: string; role: string };
// }

// export async function create(req: AuthRequest, res: Response) {
//     try {
//         if (!req.user || !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) throw new Error("Unauthorized");
//         const officer = await createOfficer(req.body);
//         res.status(201).json({ success: true, officer });
//     } catch (error: any) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// }

// export async function list(req: AuthRequest, res: Response) {
//     try {
//         if (!req.user || !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) throw new Error("Unauthorized");
//         const officers = await getOfficers();
//         res.json({ success: true, officers });
//     } catch (error: any) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// }

// export async function get(req: AuthRequest, res: Response) {
//     try {
//         if (!req.user) throw new Error("Unauthorized");
//         const { id } = req.params;
//         const officer = await getOfficer(id);
//         res.json({ success: true, officer });
//     } catch (error: any) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// }

// export async function update(req: AuthRequest, res: Response) {
//     try {
//         if (!req.user || !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) throw new Error("Unauthorized");
//         const { id } = req.params;
//         const updated = await updateOfficer(id, req.body);
//         res.json({ success: true, updated });
//     } catch (error: any) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// }

// export async function remove(req: AuthRequest, res: Response) {
//     try {
//         if (!req.user || !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) throw new Error("Unauthorized");
//         const { id } = req.params;
//         await deleteOfficer(id);
//         res.json({ success: true });
//     } catch (error: any) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// }