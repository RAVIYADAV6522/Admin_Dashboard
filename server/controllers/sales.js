import overallStat from "../models/OverallStat.js";
import { getOrSet, cacheKeys } from "../services/cache.js";

export const getSales = async (req, res, next) => {
  try {
    const payload = await getOrSet(cacheKeys.sales, 900, async () => {
      const overallStats = await overallStat.find().lean();
      return overallStats[0] ?? null;
    });
    if (!payload) {
      return res.status(404).json({ message: "No sales data found" });
    }
    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};
