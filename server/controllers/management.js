import mongoose from "mongoose";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import { AppError } from "../utils/AppError.js";

export const getAdmins = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 0;
    const pageSize = Math.min(Number(req.query.pageSize) || 25, 100);

    const total = await User.countDocuments({ role: "admin" });
    const admins = await User.find({ role: "admin" })
      .select("-password")
      .sort({ _id: 1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      data: admins,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPerformance = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userWithStats = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "affiliatestats",
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats",
        },
      },
      { $unwind: "$affiliateStats" },
    ]);

    if (!userWithStats.length) {
      throw new AppError("User performance not found", 404);
    }

    const saleTransactions = await Promise.all(
      userWithStats[0].affiliateStats.affiliateSales.map((tid) =>
        Transaction.findById(tid).lean()
      )
    );

    const filteredSaleTransactions = saleTransactions.filter((t) => t !== null);

    res.status(200).json({ user: userWithStats[0], sales: filteredSaleTransactions });
  } catch (error) {
    next(error);
  }
};
