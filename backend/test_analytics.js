import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "./src/models/Book.js";
import Order from "./src/models/Order.js";
import Category from "./src/models/Category.js";
import Author from "./src/models/Author.js";

dotenv.config();

const run = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/oldbooksstore");
    console.log("Connected!");

    console.log("Fetching books...");
    const books = await Book.find().populate("category").populate("author");
    console.log(`Fetched ${books.length} books.`);

    console.log("Fetching orders...");
    const orders = await Order.find({});
    console.log(`Fetched ${orders.length} orders.`);

    console.log("Running mapping logic...");
    const getBookIdStr = (bookField) => {
      if (!bookField) return "";
      if (typeof bookField === "string") return bookField;
      if (bookField._id) {
        return bookField._id.toString();
      }
      return bookField.toString();
    };

    const booksWithStats = books.map((book, idx) => {
      if (!book || !book._id) {
        console.log(`Book at index ${idx} is null/undefined!`);
        return {};
      }
      const bookIdStr = book._id.toString();

      // Find orders that contain this book
      const bookOrders = orders.filter((order) =>
        (order.orderItems || []).some((item) => {
          if (!item || !item.book) return false;
          const itemId = getBookIdStr(item.book);
          return itemId === bookIdStr;
        })
      );

      const totalOrders = bookOrders.length;
      const cancelledOrders = bookOrders.filter((o) => o.orderStatus === "Cancelled").length;
      const deliveredOrders = bookOrders.filter((o) => o.orderStatus === "Delivered").length;
      const pendingOrders = bookOrders.filter((o) => 
        o.orderStatus !== "Delivered" && o.orderStatus !== "Cancelled"
      ).length;

      let totalQuantitySold = 0;
      let totalRevenue = 0;

      bookOrders.forEach((order) => {
        (order.orderItems || []).forEach((item) => {
          if (item && item.book) {
            const itemId = getBookIdStr(item.book);
            if (itemId === bookIdStr) {
              totalQuantitySold += item.quantity || 0;
              // Only add to revenue if the order is not cancelled
              if (order.orderStatus !== "Cancelled") {
                totalRevenue += (item.price || 0) * (item.quantity || 0);
              }
            }
          }
        });
      });

      const bookObj = book.toObject();

      return {
        ...bookObj,
        stock: bookObj.stock || 0,
        originalPrice: bookObj.originalPrice || 0,
        discountedPrice: bookObj.discountedPrice || 0,
        totalOrders,
        cancelledOrders,
        deliveredOrders,
        pendingOrders,
        totalQuantitySold,
        totalRevenue,
        totalProfit: Math.round(totalRevenue * 0.4),
      };
    });

    console.log(`Mapped stats for ${booksWithStats.length} books successfully!`);
    if (booksWithStats.length > 0) {
      console.log("First book sample stats:", {
        title: booksWithStats[0].title,
        totalOrders: booksWithStats[0].totalOrders,
        totalRevenue: booksWithStats[0].totalRevenue
      });
    } else {
      console.log("No books found in DB.");
    }

  } catch (error) {
    console.error("CRITICAL ERROR:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
};

run();
