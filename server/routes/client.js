import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
} from "../controllers/client.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  paginationQuerySchema,
  transactionsQuerySchema,
} from "../validation/schemas.js";

const router = express.Router();

router.get(
  "/products",
  requireAuth,
  validate({ query: paginationQuerySchema }),
  getProducts
);
router.get(
  "/customers",
  requireAuth,
  validate({ query: paginationQuerySchema }),
  getCustomers
);
router.get(
  "/transactions",
  requireAuth,
  validate({ query: transactionsQuerySchema }),
  getTransactions
);
router.get("/geography", requireAuth, getGeography);

export default router;
