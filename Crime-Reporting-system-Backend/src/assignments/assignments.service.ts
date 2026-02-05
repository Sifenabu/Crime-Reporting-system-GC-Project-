// // src/modules/assignments/assignment.service.ts
// import { prisma } from "../../config/db";
// import { getDistance } from "../../utils/distance.util";
// import { AssignmentMethod, OfficerAvailability, NotificationType, NotificationChannel } from "@prisma/client";
// import { createNotification } from "../notifications/notifications.service"; // Import notification service
// import { io } from "../../../src/server"; // Import Socket.io server (exported from server.ts)

// interface AssignmentResult {
//     assigned: boolean;
//     reason?: string;
//     officer?: string;
//     distanceKm?: string;
//     activeCases?: number;
// }

// /**
//  * Auto-assign the nearest available officer to a report
//  */
// export async function autoAssignNearestOfficer(
//     reportId: string,
//     reportLat: number,
//     reportLng: number
// ): Promise<AssignmentResult> {
//     const officers = await prisma.officerProfile.findMany({
//         where: {
//             availability: OfficerAvailability.ON_DUTY,
//             currentLat: { not: null },
//             currentLng: { not: null },
//         },
//         include: {
//             user: { select: { id: true, fullName: true } },
//             assignments: {
//                 where: {
//                     report: { status: { in: ["NEW", "ASSIGNED", "IN_PROGRESS"] } },
//                 },
//             },
//         },
//     });

//     if (officers.length === 0) {
//         return { assigned: false, reason: "No officers on duty" };
//     }

//     const candidates = officers.map(officer => {
//         const distance = getDistance(reportLat, reportLng, officer.currentLat!, officer.currentLng!);
//         const activeCases = officer.assignments.length;
//         const score = distance + activeCases * 3; // Penalty for busy officers

//         return {
//             officerId: officer.id,
//             userId: officer.user.id,
//             fullName: officer.user.fullName,
//             distance,
//             activeCases,
//             score,
//         };
//     });

//     candidates.sort((a, b) => a.score - b.score);
//     const best = candidates[0];

//     if (best.distance > 15) {
//         return { assigned: false, reason: "No officer within 15km" };
//     }

//     await prisma.$transaction(async (tx) => {
//         // Create assignment
//         await tx.assignment.create({
//             data: {
//                 reportId,
//                 officerId: best.officerId,
//                 method: AssignmentMethod.AUTO,
//                 distanceKm: Number(best.distance.toFixed(2)),
//             },
//         });

//         // Assign to report
//         await tx.report.update({
//             where: { id: reportId },
//             data: { assignedOfficerId: best.officerId },
//         });

//         // Trigger notification for the assigned officer
//         await createNotification({
//             userId: best.userId,
//             reportId,
//             type: NotificationType.CASE_ASSIGNED,
//             title: "New Case Assigned",
//             body: `You have been assigned to case ${reportId.slice(-8)} (${best.distance.toFixed(1)}km away)`,
//             data: { reportId, method: "AUTO" },
//         });
//     });

//     return {
//         assigned: true,
//         officer: best.fullName,
//         distanceKm: best.distance.toFixed(2),
//         activeCases: best.activeCases,
//     };
// }

// /**
//  * Manually assign an officer to a report (admin/operator action)
//  */
// export async function manualAssignOfficer(
//     reportId: string,
//     officerId: string,
//     assignedById: string
// ) {
//     const officer = await prisma.officerProfile.findUnique({
//         where: { id: officerId },
//         include: { user: true },
//     });

//     if (!officer) throw new Error("Officer not found");

//     const report = await prisma.report.findUnique({
//         where: { id: reportId },
//         select: { lat: true, lng: true },
//     });

//     if (!report) throw new Error("Report not found");

//     const distance = report.lat && report.lng && officer.currentLat && officer.currentLng
//         ? getDistance(report.lat, report.lng, officer.currentLat, officer.currentLng)
//         : null;

//     await prisma.$transaction(async (tx) => {
//         // Create assignment
//         await tx.assignment.create({
//             data: {
//                 reportId,
//                 officerId,
//                 assignedById,
//                 method: AssignmentMethod.MANUAL,
//                 distanceKm: distance ? Number(distance.toFixed(2)) : null,
//             },
//         });

//         // Update report
//         await tx.report.update({
//             where: { id: reportId },
//             data: { assignedOfficerId: officerId },
//         });

//         // Trigger notification for the assigned officer
//         await createNotification({
//             userId: officer.user.id,
//             senderId: assignedById, // Who assigned it
//             reportId,
//             type: NotificationType.CASE_ASSIGNED,
//             title: "Case Assigned Manually",
//             body: `You have been manually assigned to case ${reportId.slice(-8)}`,
//             data: { assignedBy: assignedById, method: "MANUAL" },
//         });
//     });

//     return { success: true, officer: officer.user.fullName };
// }



// src/modules/assignments/assignments.service.ts
import { prisma } from "../../config/db";
import { getDistance } from "../../utils/distance.util";
import { AssignmentMethod, OfficerAvailability, NotificationType, NotificationChannel, AssignmentStatus } from "@prisma/client";
import { createNotification, notifyAdmins } from "../notifications/notifications.service";

// enum AssignmentStatus {
//     PRE_ASSIGNED = "PRE_ASSIGNED",
//     ACTIVE = "ACTIVE",
// }

// Interface for assignment result
interface AssignmentResult {
    assigned: boolean;
    reason?: string;
    officer?: string;
    distanceKm?: string;
    activeCases?: number;
}

/**
 * Auto-assign the nearest available officer to a report (pre-assignment, before approval)
 * - Only ON_DUTY officers
 * - Respects maxActiveCases via activeCaseCount
 * - Sets preAssignedOfficerId on Report
 * - Creates Assignment with PRE_ASSIGNED status
 * - NO notification yet (wait for approval)
 */
export async function autoAssignNearestOfficer(
    reportId: string,
    reportLat: number,
    reportLng: number
): Promise<AssignmentResult> {
    // Fetch ON_DUTY officers with location and current load
    const officers = await prisma.officerProfile.findMany({
        where: {
            availability: OfficerAvailability.ON_DUTY,
            currentLat: { not: null },
            currentLng: { not: null },
        },
        include: {
            user: { select: { id: true, fullName: true } },
            _count: { select: { assignments: true } },
        },
    });

    // Prisma cannot compare two columns/fields in a where clause (e.g. activeCaseCount < maxActiveCases),
    // so filter the results in JS after fetching.
    const availableOfficers = officers.filter(officer =>
        (officer._count?.assignments ?? 0) < (officer.maxActiveCases ?? Number.POSITIVE_INFINITY)
    );

    if (availableOfficers.length === 0) {
        return { assigned: false, reason: "No officers on duty or all at max capacity" };
    }

    // Calculate scores
    const candidates = availableOfficers.map(officer => {
        const distance = getDistance(reportLat, reportLng, officer.currentLat!, officer.currentLng!);
        const activeCases = officer._count?.assignments ?? 0;
        const score = distance + activeCases * 3; // Penalty for busy officers

        return {
            officerId: officer.id,
            userId: officer.user.id,
            fullName: officer.user.fullName,
            distance,
            activeCases,
            score,
        };
    });

    candidates.sort((a, b) => a.score - b.score);
    const best = candidates[0];

    if (best.distance > 15) {
        return { assigned: false, reason: "No officer within 15km" };
    }

    await prisma.$transaction(async (tx) => {
        // Create pre-assignment
        await tx.assignment.create({
            data: {
                reportId,
                officerId: best.officerId,
                method: AssignmentMethod.AUTO,
                distanceKm: Number(best.distance.toFixed(2)),
            },
        });

        // Set preAssigned on report
        await tx.report.update({
            where: { id: reportId },
            data: { preAssignedOfficerId: best.officerId },
        });
    });

    return {
        assigned: true,
        officer: best.fullName,
        distanceKm: best.distance.toFixed(2),
        activeCases: best.activeCases,
    };
}

/**
 * Manually assign an officer to a report
 * - If report is pre-approved, sets preAssignedOfficerId
 * - If approved, sets assignedOfficerId + updates activeCaseCount + notifies
 */
// export async function manualAssignOfficer(
//     reportId: string,
//     officerId: string,
//     assignedById: string
// ) {
//     const officer = await prisma.officerProfile.findUnique({
//         where: { id: officerId },
//         include: { user: true },
//     });

//     if (!officer) throw new Error("Officer not found");

//     const report = await prisma.report.findUnique({
//         where: { id: reportId },
//         select: { lat: true, lng: true, status: true },
//     });

//     if (!report) throw new Error("Report not found");

//     const distance = report.lat && report.lng && officer.currentLat && officer.currentLng
//         ? getDistance(report.lat, report.lng, officer.currentLat, officer.currentLng)
//         : null;

//     const method = AssignmentMethod.MANUAL;
//     const status = report.status === 'NEW' || report.status === 'PENDING_REVIEW'
//         ? AssignmentStatus.PRE_ASSIGNED
//         : AssignmentStatus.ACTIVE;

//     await prisma.$transaction(async (tx) => {
//         // Create assignment
//         await tx.assignment.create({
//             data: {
//                 reportId,
//                 officerId,
//                 assignedById,
//                 method,
//                 distanceKm: distance ? Number(distance.toFixed(2)) : null,
//             },
//         });

//         // Update report based on status
//         if (status === AssignmentStatus.PRE_ASSIGNED) {
//             await tx.report.update({
//                 where: { id: reportId },
//                 data: { preAssignedOfficerId: officerId },
//             });
//         } else {
//             await tx.report.update({
//                 where: { id: reportId },
//                 data: { assignedOfficerId: officerId },
//             });

//             // Update activeCaseCount (increment)
//             await tx.officerProfile.update({
//                 where: { id: officerId },
//                 data: { activeCaseCount: { increment: 1 } },
//             });
//         }
//     });

//     // Send notification ONLY if ACTIVE
//     if (status === AssignmentStatus.ACTIVE) {
//         await createNotification({
//             userId: officer.user.id,
//             senderId: assignedById,
//             reportId,
//             type: NotificationType.CASE_ASSIGNED,
//             title: "Case Assigned Manually",
//             body: `You have been manually assigned to case ${reportId.slice(-8)}`,
//             data: { assignedBy: assignedById, method: "MANUAL" },
//         });
//     }

//     return { success: true, officer: officer.user.fullName };
// }

export async function manualAssignOfficer(
    reportId: string,
    officerId: string,
    assignedById: string
) {
    const officer = await prisma.officerProfile.findUnique({
        where: { id: officerId },
        include: { user: true },
    });

    if (!officer) throw new Error("Officer not found");

    const report = await prisma.report.findUnique({
        where: { id: reportId },
        select: { lat: true, lng: true, status: true },
    });

    if (!report) throw new Error("Report not found");

    const distance = report.lat && report.lng && officer.currentLat && officer.currentLng
        ? getDistance(report.lat, report.lng, officer.currentLat, officer.currentLng)
        : null;

    // 2. Determine the status using the Prisma Enum
    const status = (report.status === 'NEW' || report.status === 'PENDING_REVIEW')
        ? AssignmentStatus.PRE_ASSIGNED
        : AssignmentStatus.ACTIVE;

    await prisma.$transaction(async (tx) => {
        // 3. Create assignment - INCLUDE THE STATUS FIELD
        await tx.assignment.create({
            data: {
                reportId,
                officerId,
                assignedById,
                method: AssignmentMethod.MANUAL,
                distanceKm: distance ? Number(distance.toFixed(2)) : null,
                status: status, // 👈 This was missing and caused the 400 error
            },
        });

        // 4. Update report
        if (status === AssignmentStatus.PRE_ASSIGNED) {
            await tx.report.update({
                where: { id: reportId },
                data: { preAssignedOfficerId: officerId },
            });
        } else {
            await tx.report.update({
                where: { id: reportId },
                data: {
                    assignedOfficerId: officerId,
                    status: 'ASSIGNED' // Moves report to assigned state
                },
            });

            await tx.officerProfile.update({
                where: { id: officerId },
                data: { activeCaseCount: { increment: 1 } },
            });
        }
    });

    // 5. Notification Logic
    if (status === AssignmentStatus.ACTIVE) {
        await createNotification({
            userId: officer.user.id,
            senderId: assignedById,
            reportId,
            type: NotificationType.CASE_ASSIGNED,
            title: "Case Assigned Manually",
            body: `You have been manually assigned to case ${reportId.slice(-8)}`,
            data: { assignedBy: assignedById, method: "MANUAL" },
        });

        // Notify Admins
        await notifyAdmins({
            senderId: assignedById,
            reportId,
            type: NotificationType.ASSIGNMENT,
            title: "Officer Assigned Manually",
            body: `${officer.user.fullName} was manually assigned to case ${reportId.slice(-8)}`,
            data: { officerId, assignedBy: assignedById }
        });
    }

    return { success: true, officer: officer.user.fullName };
}
/**
 * Approve a report: move pre-assignment to final, update status, notify officer
 * - Called by operator/admin/super admin when approving
 * - Increments activeCaseCount on officer
 * - Triggers notification
 * - Handles reassignment if needed
 */
// export async function approveReport(
//     reportId: string,
//     approverId: string,
//     overrideOfficerId?: string  // Optional: for reassignment during approval
// ) {
//     const report = await prisma.report.findUnique({
//         where: { id: reportId },
//         select: {
//             preAssignedOfficerId: true,
//             status: true,
//         },
//     });

//     if (!report) throw new Error("Report not found");
//     if (report.status !== 'PENDING_REVIEW') throw new Error("Report not pending approval");

//     const finalOfficerId = overrideOfficerId || report.preAssignedOfficerId;
//     if (!finalOfficerId) throw new Error("No officer to assign");

//     const officer = await prisma.officerProfile.findUnique({
//         where: { id: finalOfficerId },
//         include: { user: true },
//     });

//     if (!officer) throw new Error("Officer not found");

//     await prisma.$transaction(async (tx) => {
//         // Update report: move pre → final, set status APPROVED
//         await tx.report.update({
//             where: { id: reportId },
//             data: {
//                 preAssignedOfficerId: null,  // Clear pre
//                 assignedOfficerId: finalOfficerId,
//                 status: 'ASSIGNED',
//             },
//         });

//         // Update assignment status to ACTIVE
//         await tx.assignment.updateMany({
//             where: { reportId },
//             data: { status: AssignmentStatus.ACTIVE },
//         });

//         // Increment officer's activeCaseCount
//         await tx.officerProfile.update({
//             where: { id: finalOfficerId },
//             data: { activeCaseCount: { increment: 1 } },
//         });
//     });

//     // Send notification to assigned officer
//     await createNotification({
//         userId: officer.user.id,
//         senderId: approverId,
//         reportId,
//         type: NotificationType.CASE_ASSIGNED,
//         title: "New Case Approved and Assigned",
//         body: `Case ${reportId.slice(-8)} has been approved and assigned to you.`,
//         data: { approvedBy: approverId },
//     });

//     return { success: true, assignedOfficer: officer.user.fullName };
// }



// In assignments.service.ts — add this function

// ... imports ...

export async function approveReport(
    reportId: string,
    approverId: string,
    overrideOfficerId?: string
) {
    // 1. Fetch the report to find who was pre-assigned
    const report = await prisma.report.findUnique({
        where: { id: reportId },
        select: { preAssignedOfficerId: true, status: true, caseNumber: true },
    });

    if (!report) throw new Error("Report not found");
    if (report.status !== 'PENDING_REVIEW') throw new Error("Report not pending approval");

    const finalOfficerId = overrideOfficerId || report.preAssignedOfficerId;
    if (!finalOfficerId) throw new Error("No officer to assign");

    const officer = await prisma.officerProfile.findUnique({
        where: { id: finalOfficerId },
        include: { user: true },
    });

    if (!officer) throw new Error("Officer not found");

    // 2. Perform the database swap inside a transaction
    await prisma.$transaction(async (tx) => {
        await tx.report.update({
            where: { id: reportId },
            data: {
                preAssignedOfficerId: null,
                assignedOfficerId: finalOfficerId,
                status: 'ASSIGNED', // Or 'ACTIVE' depending on your Enum
            },
        });

        await tx.assignment.updateMany({
            where: { reportId },
            data: { status: 'ACTIVE' },
        });

        await tx.officerProfile.update({
            where: { id: finalOfficerId },
            data: { activeCaseCount: { increment: 1 } },
        });
    });

    // 3. 🔥 THE FIX: Send the REAL notification here
    await createNotification({
        userId: officer.user.id, // This is the UUID of the User record
        senderId: approverId,
        reportId: reportId,
        type: NotificationType.CASE_ASSIGNED,
        title: "New Case Assigned",
        body: `Case #${report.caseNumber} has been approved and assigned to you.`,
        data: { caseNumber: report.caseNumber }
    });

    // Notify Admins
    await notifyAdmins({
        senderId: approverId,
        reportId: reportId,
        type: NotificationType.ASSIGNMENT,
        title: "Case Assigned",
        body: `Case #${report.caseNumber} has been assigned to ${officer.user.fullName}`,
        data: { officerId: finalOfficerId, caseNumber: report.caseNumber }
    });

    return { success: true, assignedOfficer: officer.user.fullName };
}
export async function forceAutoAssignNearestOfficer(
    reportId: string,
    reportLat: number,
    reportLng: number
): Promise<AssignmentResult> {
    // Same as autoAssign, but IGNORE activeCaseCount limit
    const officers = await prisma.officerProfile.findMany({
        where: {
            availability: OfficerAvailability.ON_DUTY,
            currentLat: { not: null },
            currentLng: { not: null },
        },
        include: {
            user: { select: { id: true, fullName: true } },
            _count: { select: { assignments: true } },
        },
    });

    if (officers.length === 0) {
        return { assigned: false, reason: "No officers on duty" };
    }

    // Scoring logic (ignore maxActiveCases — we force even if busy)
    const candidates = officers.map(officer => {
        const distance = getDistance(reportLat, reportLng, officer.currentLat!, officer.currentLng!);
        const activeCases = officer._count?.assignments ?? 0;
        const score = distance + activeCases * 3; // Penalty for busy officers

        return {
            officerId: officer.id,
            userId: officer.user.id,
            fullName: officer.user.fullName,
            distance,
            activeCases,
            score,
        };
    });

    if (candidates.length === 0) {
        return { assigned: false, reason: "No candidate officers found" };
    }

    candidates.sort((a, b) => a.score - b.score);
    const best = candidates[0];

    // Optional: still respect a distance threshold (remove this check if you want to force regardless of distance)
    if (best.distance > 15) {
        return { assigned: false, reason: "No officer within 15km" };
    }

    // Force assign even if over limit
    await prisma.$transaction(async (tx) => {
        await tx.assignment.create({
            data: {
                reportId,
                officerId: best.officerId,
                method: AssignmentMethod.AUTO,
                distanceKm: Number(best.distance.toFixed(2)),
                status: AssignmentStatus.PRE_ASSIGNED,
            },
        });

        await tx.report.update({
            where: { id: reportId },
            data: { preAssignedOfficerId: best.officerId },
        });

        // Still increment count (can go over configured max)
        await tx.officerProfile.update({
            where: { id: best.officerId },
            data: { activeCaseCount: { increment: 1 } },
        });
    });



    return { assigned: true, officer: best.fullName, distanceKm: best.distance.toFixed(2), activeCases: best.activeCases + 1 };
}