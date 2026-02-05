// src/modules/reports/reports.controller.ts
import { Request, Response } from "express";
import {
    createReportService,
    deleteReportService,
    getReportByIdService,
    getReportsService,
    updateReportService,
    updateReportPriority,
} from "./reports.service";
import { Priority, ReportStatusEnum } from "@prisma/client";
import cloudinary from "../../config/cloudinary";
import { uploadEvidence } from "../../middlewares/upload.middleware";
import multer from "multer";
import { prisma } from "../../config/db";

interface AuthRequest extends Request {
    user?: { sub: string };
}


export async function createReport(req: AuthRequest, res: Response) {
    uploadEvidence(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: err.message || "File upload failed",
            });
        }

        try {
            const files = req.files as Express.Multer.File[];
            const evidenceRecords = [];

            // Upload files to Cloudinary
            if (files && files.length > 0) {
                for (const file of files) {
                    const result: any = await new Promise((resolve, reject) => {
                        cloudinary.uploader
                            .upload_stream(
                                {
                                    folder: "adama-crime-reports",
                                    resource_type: file.mimetype.startsWith("video") ? "video" : "image",
                                },
                                (error, result) => {
                                    if (error) reject(error);
                                    else resolve(result);
                                }
                            )
                            .end(file.buffer);
                    });

                    const type = file.mimetype.startsWith("video") ? "VIDEO" : "IMAGE";

                    evidenceRecords.push({
                        type,
                        url: result.secure_url,
                        publicId: result.public_id,
                        format: result.format,
                        sizeBytes: result.bytes,
                    });
                }
            }

            const userId = req.user?.sub;

            const reportData = {
                title: req.body.title as string,
                description: req.body.description as string,
                crimeTypeId: req.body.crimeTypeId ? Number(req.body.crimeTypeId) : undefined,
                priority: req.body.priority as any,
                locationId: req.body.locationId ? Number(req.body.locationId) : undefined,
                lat: req.body.lat ? Number(req.body.lat) : undefined,
                lng: req.body.lng ? Number(req.body.lng) : undefined,
                isAnonymous: req.body.isAnonymous === "true" || req.body.isAnonymous === true,
                reporterName: req.body.reporterName as string | undefined,
                reporterPhone: req.body.reporterPhone as string | undefined,
                reporterEmail: req.body.reporterEmail as string | undefined,
                userId,
            };

            // Create report (without evidence)
            const report = await createReportService(reportData);

            // Save evidence to DB
            if (evidenceRecords.length > 0) {
                await prisma.evidence.createMany({
                    data: evidenceRecords.map((ev) => ({
                        reportId: report.id,
                        type: ev.type as any,
                        url: ev.url,
                        publicId: ev.publicId,
                        format: ev.format,
                        sizeBytes: ev.sizeBytes,
                    })),
                });
            }

            // RELOAD REPORT WITH EVIDENCE INCLUDED
            const fullReport = await prisma.report.findUnique({
                where: { id: report.id },
                include: {
                    evidence: true,
                    crimeType: true,
                    location: true,
                    createdBy: { select: { fullName: true, email: true } },
                    assignedOfficer: { select: { user: { select: { fullName: true } } } },
                },
            });

            res.status(201).json({
                success: true,
                message: "Report with evidence submitted successfully",
                report: fullReport,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message || "Failed to submit report",
            });
        }
    });
}

// GET ALL REPORTS
export async function getReports(req: AuthRequest, res: Response) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const status = req.query.status as ReportStatusEnum | undefined;
        const priority = req.query.priority as Priority | undefined;

        const data = await getReportsService({ page, limit, status, priority });
        res.json({ success: true, ...data });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// GET SINGLE REPORT
export async function getSingleReport(req: AuthRequest, res: Response) {
    try {
        const { id } = req.params;
        const userId = req.user?.sub;
        const report = await updateReportService(id, { ...req.body }, userId);
        res.json({ success: true, report });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to update report" });
    }
}

export async function updateReportPriorityController(req: AuthRequest, res: Response) {
    try {
        if (!req.user) return res.status(401).json({ error: "Unauthorized: User not found in request" });

        const { id } = req.params;
        const { priority } = req.body;
        const userId = req.user.sub;

        if (!priority) return res.status(400).json({ error: "Priority is required" });

        // Normalize to UPPERCASE to match Prisma enum
        const normalizedPriority = priority.toUpperCase();
        console.log(`[Priority Update] ID: ${id}, New Priority: ${normalizedPriority}, User: ${userId}`);

        const report = await updateReportPriority(id, normalizedPriority as any, userId);
        res.json({ success: true, report });
    } catch (error: any) {
        console.error("[Backend Error] updateReportPriorityController failed:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update priority",
            details: error.message
        });
    }
}

// UPDATE REPORT
export async function updateReport(req: AuthRequest, res: Response) {
    try {
        const { id } = req.params;
        const userId = req.user?.sub;

        const report = await updateReportService(id, req.body, userId);

        res.json({
            success: true,
            message: "Report updated successfully",
            report,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            error: error.message || "Failed to update report",
        });
    }
}

// DELETE REPORT
export async function deleteReport(req: AuthRequest, res: Response) {
    try {
        const { id } = req.params;
        await deleteReportService(id);
        res.json({ success: true, message: "Report deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
}
// // src/modules/report/report.controller.ts
// import { Request, Response } from "express";
// import { createReportService, deleteReportService, getReportByIdService, getReportsService, updateReportService } from "./reports.service";
// import { Priority, ReportStatusEnum } from "@prisma/client";

// interface AuthRequest extends Request {
//     user?: { sub: string };  // from JWT
// }
// export async function createReport(req: AuthRequest, res: Response) {
//     try {
//         const userId = req.user?.sub;

//         const report = await createReportService({
//             title: req.body.title,
//             description: req.body.description,
//             crimeTypeId: req.body.crimeTypeId,
//             priority: req.body.priority,
//             locationId: req.body.locationId,
//             lat: req.body.lat,
//             lng: req.body.lng,
//             isAnonymous: req.body.isAnonymous,
//             reporterName: req.body.reporterName,
//             reporterPhone: req.body.reporterPhone,
//             reporterEmail: req.body.reporterEmail,
//             userId,
//         });

//         res.status(201).json({
//             success: true,
//             message: "Report submitted successfully",
//             report,
//         });
//     } catch (error: any) {
//         res.status(400).json({
//             success: false,
//             error: error.message || "Failed to create report",
//         });
//     }
// }

// export async function getReports(req: AuthRequest, res: Response) {
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 20;
//     const status = req.query.status as ReportStatusEnum;
//     const priority = req.query.priority as Priority;

//     const data = await getReportsService({ page, limit, status, priority });
//     res.json({ success: true, ...data });
// }

// export async function getSingleReport(req: AuthRequest, res: Response) {
//     const { id } = req.params;
//     const report = await getReportByIdService(id);
//     res.json({ success: true, report });
// }

// // src/modules/reports/reports.controller.ts
// export async function updateReport(req: AuthRequest, res: Response) {
//     try {
//         const { id } = req.params;
//         const userId = req.user?.sub;  // ← ? instead of ! → safe

//         const report = await updateReportService(id, req.body, userId);

//         res.json({
//             success: true,
//             message: "Report updated successfully",
//             report,
//         });
//     } catch (error: any) {
//         res.status(400).json({
//             success: false,
//             error: error.message || "Failed to update report",
//         });
//     }
// }

// export async function deleteReport(req: AuthRequest, res: Response) {
//     const { id } = req.params;
//     await deleteReportService(id);
//     res.json({ success: true, message: "Report deleted" });
// }