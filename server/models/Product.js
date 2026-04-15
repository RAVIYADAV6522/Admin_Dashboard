// Scheme for user - reperesent the model of the data
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    catagory: String,
    rating: Number,
    supply: Number,
  },
  { timestamps: true }
);
// Create a model from the schema
const Product = mongoose.model("Product", ProductSchema);
export default Product;


