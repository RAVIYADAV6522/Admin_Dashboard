import User from "../models/User.js";

import Transaction from "../models/Transaction.js";
import OverallStat from "../models/OverallStat.js";
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: error.message })
  }

};

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.toLocaleString("default", { month: "long" });
    const currentYear = now.getFullYear();
    const currentDay = now.toISOString().split("T")[0];

    /* Recent Transactions */
    const transactions = await Transaction.find().limit(50).sort({ createdAt: -1 }).lean();

    /* Overall Stats*/
    const overallStat = await OverallStat.find({ year: currentYear });

    const {
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory
    } = overallStat[0]

    const thisMonthStat = overallStat[0].monthlyData.find(({ month }) => {
      return month === currentMonth;
    });
    const todayStats = overallStat[0].dailyData.find(({ date }) => {
      return date === currentDay;
    });

    res.status(200).json({
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
      thisMonthStat,
      todayStats,
      transactions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}