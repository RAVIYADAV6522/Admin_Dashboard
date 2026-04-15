import overallStat from "../models/OverallStat.js";
import { getOrSet, cacheKeys } from "../services/cache.js";

const emptySalesPayload = () => ({
  totalCustomers: 0,
  yearlySalesTotal: 0,
  yearlyTotalSoldUnits: 0,
  year: new Date().getFullYear(),
  monthlyData: [],
  dailyData: [],
  salesByCategory: {},
});

export const getSales = async (req, res, next) => {
  try {
    const payload = await getOrSet(cacheKeys.sales, 900, async () => {
      const overallStats = await overallStat.find().lean();
      return overallStats[0] ?? emptySalesPayload();
    });
    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};
