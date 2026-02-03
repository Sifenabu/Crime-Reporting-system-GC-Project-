// // src/modules/ai/ai.routes.ts
// import { Router } from "express";
// import { authMiddleware } from "../../middlewares/auth.middleware";
// import { queryAI } from "./ai.service";

// const router = Router();

// // Public AI (no auth)
// router.post("/public", async (req, res) => {
//   const { query } = req.body;
//   if (!query) return res.status(400).json({ error: "Query required" });

//   try {
//     const result = await queryAI(query, "PUBLIC");
//     res.json(result);
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Authenticated AI (admin/officer)
// router.post("/query", authMiddleware, async (req: any, res) => {
//   const { query } = req.body;
//   if (!query) return res.status(400).json({ error: "Query required" });

//   const role = req.user.role;

//   try {
//     const result = await queryAI(query, role);
//     res.json(result);
//   } catch (err: any) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

// src/modules/ai/ai.routes.ts
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { indexPrivateData, indexPublicData, queryAI } from "./ai.service";

const router = Router();

// Public AI (no auth)
router.post("/public", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query required" });

  try {
    const result = await queryAI(query, "PUBLIC");
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Authenticated AI (admin/officer)
router.post("/query", authMiddleware, async (req: any, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query required" });

  const role = req.user.role;

  try {
    const result = await queryAI(query, role);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Add these to your existing ai.routes.ts
router.post("/index-public", authMiddleware, async (req, res) => {
  try {
    await indexPublicData();
    res.json({ message: "Public indexing complete" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/index-private", authMiddleware, async (req, res) => {
  try {
    await indexPrivateData();
    res.json({ message: "Private indexing complete" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Keep this — default export
export default router;