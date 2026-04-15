import "../loadEnv.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import Transaction from "../models/Transaction.js";
import OverallStat from "../models/OverallStat.js";
import AffiliateStat from "../models/AffiliateStat.js";
import {
  dataUser,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
} from "../data/index.js";

async function clearAll() {
  console.log("[seed] Removing existing documents (--force)…");
  await AffiliateStat.deleteMany({});
  await Transaction.deleteMany({});
  await ProductStat.deleteMany({});
  await Product.deleteMany({});
  await OverallStat.deleteMany({});
  await User.deleteMany({});
}

async function main() {
  const force = process.argv.includes("--force");

  if (!process.env.MONGO_URL) {
    console.error("[seed] MONGO_URL is missing. Set it in server/.env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URL);

  const existingUsers = await User.countDocuments();
  if (existingUsers > 0 && !force) {
    console.log(
      "[seed] This database already has users (e.g. from Register). Sample data was not imported."
    );
    console.log(
      "[seed] To replace everything with demo data, run: npm run seed:force"
    );
    console.log(
      "[seed] (That deletes all users, products, transactions, and stats in this DB.)"
    );
    await mongoose.disconnect();
    process.exit(0);
  }

  if (force && existingUsers > 0) {
    await clearAll();
  }

  console.log("[seed] Hashing user passwords (one-time)…");
  const usersWithHashed = await Promise.all(
    dataUser.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password, 10),
    }))
  );

  console.log("[seed] Inserting users…");
  await User.insertMany(usersWithHashed);

  console.log("[seed] Inserting products…");
  await Product.insertMany(dataProduct);

  console.log("[seed] Inserting product stats…");
  await ProductStat.insertMany(dataProductStat);

  console.log("[seed] Inserting transactions…");
  await Transaction.insertMany(dataTransaction);

  console.log("[seed] Inserting overall stats…");
  await OverallStat.insertMany(dataOverallStat);

  console.log("[seed] Inserting affiliate stats…");
  await AffiliateStat.insertMany(dataAffiliateStat);

  console.log("[seed] Done. Restart the API server if it is already running.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
