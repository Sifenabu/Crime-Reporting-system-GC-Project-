// // import { authMiddleware } from './../../middlewares/auth.middleware';
// // src/modules/assignments/assignments.routes.ts
// import { Router } from "express";
// import { manualAssign } from "./assignments.controller";
// import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";

// const router = Router();

// // Only ADMIN or OPERATOR can manually assign
// router.post(
//     "/manual",
//     authMiddleware,
//     requireRole(["ADMIN", "OPERATOR", "SUPER_ADMIN"]),
//     manualAssign
// );

// export default router;


// src/modules/assignments/assignments.routes.ts
import { Router } from "express";
import { manualAssign, approve, autoAssign } from "./assignments.controller";
import { authMiddleware, requireRole } from "../../middlewares/auth.middleware";
import { forceAutoAssignNearestOfficer } from "./assignments.service";

const router = Router();

// Apply auth to all
router.use(authMiddleware);

// Auto-assignment (e.g., call on report creation)
router.post(
    "/auto",
    requireRole(["ADMIN", "OPERATOR", "SUPER_ADMIN"]),
    autoAssign
);

// Manual assignment
router.post(
    "/manual",
    requireRole(["ADMIN", "OPERATOR", "SUPER_ADMIN"]),
    manualAssign
);

// Approval (activates assignment + notifies)
router.post(
    "/approve",
    requireRole(["ADMIN", "OPERATOR", "SUPER_ADMIN"]),
    approve
);

// assignments.routes.ts
router.post("/auto/force", authMiddleware, requireRole(["ADMIN", "SUPER_ADMIN"]), async (req, res) => {
    const { reportId, lat, lng } = req.body;
    const result = await forceAutoAssignNearestOfficer(reportId, lat, lng);
    res.json(result);
});
export default router;