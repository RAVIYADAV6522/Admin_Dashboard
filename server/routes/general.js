import express from "express";
import { getUser, getDashboardStats } from "../controllers/general.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validation/schemas.js";

const router = express.Router();

router.get("/user/:id", requireAuth, validate({ params: idParamSchema }), getUser);
router.get("/dashboard", requireAuth, getDashboardStats);

export default router;
