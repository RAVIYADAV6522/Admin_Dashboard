export const validate =
  ({ body: bodySchema, query: querySchema, params: paramsSchema } = {}) =>
  (req, res, next) => {
    try {
      if (bodySchema) req.body = bodySchema.parse(req.body);
      if (querySchema) req.query = querySchema.parse(req.query);
      if (paramsSchema) req.params = paramsSchema.parse(req.params);
      next();
    } catch (e) {
      if (e?.issues) {
        return res.status(400).json({
          message: "Validation failed",
          issues: e.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        });
      }
      next(e);
    }
  };
