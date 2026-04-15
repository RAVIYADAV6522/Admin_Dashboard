// Scheme for user - reperesent the model of the data
import mongoose from "mongoose";

const overallStatSchema = new mongoose.Schema(
  {
    totalCustomers: Number,
    yearlySalesTotal: Number,
    yearlyTotalSoldUnits: Number,
    year: Number,
    monthlyData: [
      {
        month: String,
        totalSales: Number,
        totalUnits: Number
      }
    ],
    dailyData: [
      {
        date: String,
        totalSales: Number,
        totalUnits: Number
      }
    ],
    salesByCategory: {
      type: Map,
      of: Number,
    }
  },
  { timestamps: true }
);

overallStatSchema.index({ year: 1 });

const overallStat = mongoose.model("overallStat", overallStatSchema);
export default overallStat;


