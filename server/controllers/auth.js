import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";

const signToken = (user) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError("JWT_SECRET is not configured", 500);
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError("Email already registered", 409);
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user",
    });
    const token = signToken(user);
    const safe = user.toObject();
    delete safe.password;
    res.status(201).json({ token, user: safe });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw new AppError("Invalid email or password", 401);
    }
    const token = signToken(user);
    const safe = user.toObject();
    delete safe.password;
    res.status(200).json({ token, user: safe });
  } catch (e) {
    next(e);
  }
};
