import express from "express";
import { getSales } from "../controllers/sales.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/sales", requireAuth, getSales);

export default router;
