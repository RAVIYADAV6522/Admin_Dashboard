import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3";
import { AppError } from "../utils/AppError.js";
import { getOrSet, cacheKeys } from "../services/cache.js";

export const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 0;
    const pageSize = Math.min(Number(req.query.pageSize) || 25, 100);

    const total = await Product.countDocuments();
    const products = await Product.find()
      .sort({ _id: 1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .lean();

    const productIds = products.map((p) => p._id);
    const allStats = await ProductStat.find({ productId: { $in: productIds } }).lean();

    const statsMap = {};
    allStats.forEach((stat) => {
      const key = stat.productId.toString();
      if (!statsMap[key]) statsMap[key] = [];
      statsMap[key].push(stat);
    });

    const productsWithStats = products.map((product) => ({
      ...product,
      stat: statsMap[product._id.toString()] || [],
    }));

    res.status(200).json({
      data: productsWithStats,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 0;
    const pageSize = Math.min(Number(req.query.pageSize) || 25, 100);

    const total = await User.countDocuments({ role: "user" });
    const customers = await User.find({ role: "user" })
      .select("-password")
      .sort({ _id: 1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .lean();

    res.status(200).json({
      data: customers,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const { page = 0, pageSize = 20, sort = null, search = "" } = req.query;

    let sortFormatted = {};
    if (sort) {
      let sortParsed;
      try {
        sortParsed = JSON.parse(sort);
      } catch {
        throw new AppError("Invalid sort parameter: must be valid JSON", 400);
      }
      if (sortParsed?.field) {
        sortFormatted = {
          [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1,
        };
      }
    }

    const searchFilter = search
      ? {
          $or: [
            { cost: { $regex: new RegExp(search, "i") } },
            { userId: { $regex: new RegExp(search, "i") } },
          ],
        }
      : {};

    const transactions = await Transaction.find(searchFilter)
      .sort(sortFormatted)
      .skip(Number(page) * Number(pageSize))
      .limit(Number(pageSize))
      .lean();

    const total = await Transaction.countDocuments(searchFilter);

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    next(error);
  }
};

export const getGeography = async (req, res, next) => {
  try {
    const data = await getOrSet(cacheKeys.geography, 3600, async () => {
      const users = await User.find().lean();

      const mappedLocations = users.reduce((acc, { country }) => {
        const countryISO3 = getCountryIso3(country);
        if (!acc[countryISO3]) {
          acc[countryISO3] = 0;
        }
        acc[countryISO3]++;
        return acc;
      }, {});

      return Object.entries(mappedLocations).map(([country, count]) => ({
        id: country,
        value: count,
      }));
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
