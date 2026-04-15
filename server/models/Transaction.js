// Scheme for user - reperesent the model of the data
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: String,
    cost: String,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

TransactionSchema.index({ userId: 1 });
TransactionSchema.index({ createdAt: -1 });

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;


