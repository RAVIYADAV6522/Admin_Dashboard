import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import OverallStat from "../models/OverallStat.js";
import { AppError } from "../utils/AppError.js";
import { getOrSet, cacheKeys } from "../services/cache.js";

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password").lean();
    if (!user) throw new AppError("User not found", 404);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const payload = await getOrSet(cacheKeys.dashboard, 300, async () => {
      const now = new Date();
      const currentMonth = now.toLocaleString("default", { month: "long" });
      const currentYear = now.getFullYear();
      const currentDay = now.toISOString().split("T")[0];

      const transactions = await Transaction.find()
        .limit(50)
        .sort({ createdAt: -1 })
        .lean();

      const overallStat = await OverallStat.find({ year: currentYear }).lean();
      let doc = overallStat[0];
      if (!doc) {
        const fallback = await OverallStat.find().sort({ year: -1 }).limit(1).lean();
        doc = fallback[0];
      }
      if (!doc) {
        return {
          totalCustomers: 0,
          yearlyTotalSoldUnits: 0,
          yearlySalesTotal: 0,
          monthlyData: [],
          salesByCategory: {},
          thisMonthStat: null,
          todayStats: null,
          transactions,
        };
      }

      return buildDashboardPayload(doc, currentMonth, currentDay, transactions);
    });

    res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};

function buildDashboardPayload(doc, currentMonth, currentDay, transactions) {
  const {
    totalCustomers,
    yearlyTotalSoldUnits,
    yearlySalesTotal,
    monthlyData,
    salesByCategory,
  } = doc;

  const thisMonthStat = doc.monthlyData?.find(({ month }) => month === currentMonth);
  const todayStats = doc.dailyData?.find(({ date }) => date === currentDay);

  return {
    totalCustomers,
    yearlyTotalSoldUnits,
    yearlySalesTotal,
    monthlyData,
    salesByCategory,
    thisMonthStat,
    todayStats,
    transactions,
  };
}
