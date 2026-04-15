import express from "express";
import { getAdmins, getUserPerformance } from "../controllers/management.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema, paginationQuerySchema } from "../validation/schemas.js";

const router = express.Router();

router.get(
  "/admins",
  requireAuth,
  validate({ query: paginationQuerySchema }),
  getAdmins
);
router.get(
  "/performance/:id",
  requireAuth,
  validate({ params: idParamSchema }),
  getUserPerformance
);

export default router;
