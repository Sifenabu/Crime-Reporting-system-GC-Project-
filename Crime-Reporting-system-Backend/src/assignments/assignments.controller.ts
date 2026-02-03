// // src/modules/assignments/assignments.controller.ts
// import { Request, Response } from "express";
// import { manualAssignOfficer } from "./assignments.service";


// // Use standard Request, add user later with middleware
// interface AuthenticatedRequest extends Request {
//     user?: { sub: string; role: string };  // JWT payload
// }

// export async function manualAssign(req: AuthenticatedRequest, res: Response) {
//     try {
//         if (!req.user) throw new Error("Unauthorized");

//         const { reportId, officerId } = req.body;
//         const assignedById = req.user.sub;

//         const result = await manualAssignOfficer(reportId, officerId, assignedById);

//         const { success: _ignored, ...payload } = result as any;

//         res.json({ success: true, ...payload });
//     } catch (error: any) {
//         res.status(400).json({ success: false, error: error.message });
//     }
// }


// src/modules/assignments/assignments.controller.ts
import { Request, Response } from "express";
import { manualAssignOfficer, approveReport, autoAssignNearestOfficer } from "./assignments.service";

// Use standard Request, add user later with middleware
interface AuthRequest extends Request {
    user?: { sub: string; role: string };  // JWT payload
}

export async function manualAssign(req: AuthRequest, res: Response) {
    try {
        if (!req.user) throw new Error("Unauthorized");

        const { reportId, officerId } = req.body;
        const assignedById = req.user.sub;

        const result = await manualAssignOfficer(reportId, officerId, assignedById);

        const { success: _ignored, ...payload } = result as any;
        res.json({ success: true, ...payload });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
}

// NEW: Approval controller (call when operator/admin approves a report)
export async function approve(req: AuthRequest, res: Response) {
    try {
        if (!req.user) throw new Error("Unauthorized");

        const { reportId, overrideOfficerId } = req.body; // Optional override for reassignment
        const approverId = req.user.sub;

        const result = await approveReport(reportId, approverId, overrideOfficerId);

        const { success: _ignored, ...payload } = result as any;
        res.json({ success: true, ...payload });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
}

// Optional: If you want to trigger auto-assignment separately (e.g., on report creation)
export async function autoAssign(req: AuthRequest, res: Response) {
    try {
        const { reportId, lat, lng } = req.body;

        const result = await autoAssignNearestOfficer(reportId, lat, lng);

        const { success: _ignored, ...payload } = result as any;
        res.json({ success: result.assigned, ...payload });
    } catch (error: any) {
        res.status(400).json({ success: false, error: error.message });
    }
}