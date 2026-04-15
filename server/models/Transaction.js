// Scheme for user - reperesent the model of the data
import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: String,
    cost: String,
    products: {
      type: [mongoose.Types.objectId],
      of: Number,
    },
  },
  { timestamps: true }
);
// Create a model from the schema
const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;


