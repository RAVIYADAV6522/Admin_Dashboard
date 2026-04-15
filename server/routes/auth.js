import express from "express";
import rateLimit from "express-rate-limit";
import { register, login } from "../controllers/auth.js";
import { validate } from "../middleware/validate.js";
import { registerBodySchema, loginBodySchema } from "../validation/schemas.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, validate({ body: registerBodySchema }), register);
router.post("/login", authLimiter, validate({ body: loginBodySchema }), login);

export default router;
