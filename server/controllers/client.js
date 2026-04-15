import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js"
import Transaction from "../models/Transaction.js"
import getCountryIso3 from "country-iso-2-to-3";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();
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

    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password").lean();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getTransactions = async (req, res) => {
  try {
    // sort should look like this: { "field": "userId", "sort": "desc"}
    const { page = 0, pageSize = 20, sort = null, search = "" } = req.query;

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1,
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

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
      .skip(page * pageSize)
      .limit(pageSize)
      .lean();

    const total = await Transaction.countDocuments(searchFilter);

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGeography = async (req, res) => {
  try {
    const users = await User.find().lean();

    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count }
      }
    );
    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};