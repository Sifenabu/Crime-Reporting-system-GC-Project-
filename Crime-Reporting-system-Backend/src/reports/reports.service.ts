// src/modules/reports/reports.service.ts
import { prisma } from "../../config/db";
import { Priority, ReportStatusEnum, Channel, NotificationType } from "@prisma/client";
import { autoAssignNearestOfficer } from "../assignments/assignments.service";
import { notifyAdmins } from "../notifications/notifications.service";

export async function createReportService(
    data: {
        title: string;
        description: string;
        crimeTypeId?: number;
        priority?: Priority;
        locationId?: number;
        lat?: number;
        lng?: number;
        isAnonymous?: boolean;
        reporterName?: string;
        reporterPhone?: string;
        reporterEmail?: string;
        evidenceUrls?: string[];
        userId?: string;
    }
) {
    // Validate required fields
    if (!data.title?.trim()) {
        throw new Error("Report title is required");
    }
    if (!data.description?.trim()) {
        throw new Error("Report description is required");
    }

    const caseNumber = `CASE-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const report = await prisma.report.create({
        data: {
            caseNumber,
            title: data.title.trim(),
            description: data.description.trim(),
            crimeTypeId: data.crimeTypeId || null,
            priority: data.priority || Priority.MEDIUM,
            status: ReportStatusEnum.NEW,
            channel: Channel.WEB,
            locationId: data.locationId || null,
            lat: data.lat || null,
            lng: data.lng || null,
            isAnonymous: data.isAnonymous ?? true,
            reporterName: data.isAnonymous ? null : (data.reporterName || null),
            reporterPhone: data.isAnonymous ? null : (data.reporterPhone || null),
            reporterEmail: data.isAnonymous ? null : (data.reporterEmail || null),
            createdById: data.userId || null,
        },
        include: {
            crimeType: true,
            location: true,
            createdBy: {
                select: { fullName: true, email: true, phone: true }
            },
            evidence: true,
        },
    });

    // AUTO-ASSIGNMENT — AFTER REPORT CREATED
    if (report.lat && report.lng) {
        try {
            const assignmentResult = await autoAssignNearestOfficer(
                report.id,
                report.lat,
                report.lng
            );

            if (assignmentResult.assigned) {
                console.log(
                    `✅ Auto-assigned report ${report.caseNumber} to ${assignmentResult.officer} (${assignmentResult.distanceKm}km)`
                );
            } else {
                console.log(`⚠️ No officer assigned: ${assignmentResult.reason}`);
            }
        } catch (error) {
            console.error("Auto-assignment failed:", error);
            // Do not break report creation
        }
    }

    // Notify Admins of new report
    await notifyAdmins({
        type: NotificationType.SYSTEM,
        title: "New Report Created",
        body: `New ${report.crimeType?.name || 'General'} report: ${report.title}`,
        data: { reportId: report.id, caseNumber: report.caseNumber }
    });

    return report;
}





// Get all reports (for officers/admins)
export async function getReportsService({
    page = 1,
    limit = 20,
    status,
    priority,
}: {
    page?: number;
    limit?: number;
    status?: ReportStatusEnum;
    priority?: Priority;
}) {
    const skip = (page - 1) * limit;

    const where = {
        ...(status && { status }),
        ...(priority && { priority }),
    };

    const [reports, total] = await Promise.all([
        prisma.report.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                crimeType: true,
                location: true,
                createdBy: { select: { fullName: true, email: true } },
                assignedOfficer: { select: { user: { select: { fullName: true } } } },
                evidence: true,
            },
        }),
        prisma.report.count({ where }),
    ]);

    return { reports, total, page, pages: Math.ceil(total / limit) };
}

// Get single report by ID or caseNumber
export async function getReportByIdService(idOrCase: string) {
    const report = await prisma.report.findFirst({
        where: {
            OR: [{ id: idOrCase }, { caseNumber: idOrCase }],
        },
        include: {
            crimeType: true,
            location: true,
            createdBy: { select: { fullName: true, email: true } },
            assignedOfficer: { select: { user: { select: { fullName: true } } } },
            evidence: true,
            suspects: true,
            victims: true,
            statusHistory: { orderBy: { createdAt: "desc" } },
        },
    });

    if (!report) throw new Error("Report not found");
    return report;
}

// Update report (status, assignment, etc.) — officer/admin only
// src/modules/reports/reports.service.ts
export async function updateReportService(
    id: string,
    data: Partial<{
        title: string;
        description: string;
        crimeTypeId: number;
        priority: Priority;
        locationId: number;
        lat: number;
        lng: number;
        isAnonymous: boolean;
        reporterName: string;
        reporterPhone: string;
        reporterEmail: string;
        // Officer-only
        status: ReportStatusEnum;
        assignedOfficerId: string;
        comment: string;
    }>,
    userId?: string  // optional — if logged in
) {
    // Public can only update their own report if not anonymous
    // For now, allow basic updates (we'll add auth later)

    const updateData: any = {
        title: data.title,
        description: data.description,
        crimeTypeId: data.crimeTypeId,
        priority: data.priority,
        locationId: data.locationId,
        lat: data.lat,
        lng: data.lng,
        isAnonymous: data.isAnonymous,
        reporterName: data.reporterName,
        reporterPhone: data.reporterPhone,
        reporterEmail: data.reporterEmail,
        // Officer fields
        status: data.status,
        assignedOfficerId: data.assignedOfficerId,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const report = await prisma.report.update({
        where: { id },
        data: updateData,
        include: {
            crimeType: true,
            location: true,
            createdBy: { select: { fullName: true } },
            assignedOfficer: { select: { user: { select: { fullName: true } } } },
            evidence: true,
        },
    });

    // Log status change if officer
    if (data.status && userId && data.comment) {
        await prisma.reportStatusHistory.create({
            data: {
                reportId: id,
                newStatus: data.status,
                changedById: userId,
                comment: data.comment,
            },
        });
    }

    // Notify Admins on Status Change
    if (data.status) {
        await notifyAdmins({
            senderId: userId,
            reportId: id,
            type: NotificationType.STATUS_CHANGE,
            title: "Report Status Updated",
            body: `Report #${report.caseNumber} status changed to ${data.status}`,
            data: { status: data.status, reportId: id }
        });
    }

    return report;
}
// Update report priority
export async function updateReportPriority(id: string, priority: Priority, userId: string) {
    const report = await prisma.report.update({
        where: { id },
        data: { priority },
        include: {
            crimeType: true,
            location: true,
            createdBy: { select: { fullName: true } },
            assignedOfficer: { select: { user: { select: { fullName: true } } } },
            evidence: true,
        },
    });

    // Notify admins about priority change
    await notifyAdmins({
        senderId: userId,
        reportId: id,
        type: NotificationType.SYSTEM,
        title: "Report Priority Changed",
        body: `Report #${report.caseNumber} priority changed to ${priority}`,
        data: { priority, reportId: id }
    });

    return report;
}

// Delete report (admin only)
export async function deleteReportService(id: string) {
    await prisma.report.delete({ where: { id } });
    return { success: true, message: "Report deleted" };
}