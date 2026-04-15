import { z } from "zod";

export const registerBodySchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(50),
  password: z.string().min(6).max(100),
});

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export const transactionsQuerySchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sort: z
    .preprocess(
      (v) => (v === "" || v === null || v === undefined ? null : v),
      z.string().nullable().optional()
    )
    .optional(),
  search: z.string().optional().default(""),
});

export const idParamSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid id"),
});
