import Book from "../models/Book.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import Category from "../models/Category.js";
import Author from "../models/Author.js";
import mongoose from "mongoose";
import { uploadMultipleImages, uploadSingleImage } from "../services/uploadService.js";
import Settings from "../models/Settings.js";

const applyPromoDiscounts = async (booksOrBook) => {
  try {
    const settings = await Settings.findOne();
    if (!settings || !settings.promoSection || !settings.promoSection.isActive) {
      return booksOrBook;
    }

    const endsAt = settings.promoSection.endsAt;
    if (endsAt && new Date(endsAt) <= new Date()) {
      return booksOrBook;
    }

    const discountValue = settings.promoSection.discountValue || 0;
    const discountBooks = settings.promoSection.discountBooks || [];
    if (discountBooks.length === 0 || discountValue <= 0) {
      return booksOrBook;
    }

    const bookIdSet = new Set(discountBooks.map((id) => id.toString()));

    const applyToSingle = (book) => {
      if (!book) return book;
      const b = typeof book.toObject === "function" ? book.toObject() : book;
      if (bookIdSet.has(b._id.toString())) {
        b.discountPercentage = discountValue;
        b.discountedPrice = Math.round(b.originalPrice * (1 - discountValue / 100));
        b.isPromoActive = true;
        b.promoExpiresAt = endsAt;
      }
      return b;
    };

    if (Array.isArray(booksOrBook)) {
      return booksOrBook.map(applyToSingle);
    } else {
      return applyToSingle(booksOrBook);
    }
  } catch (error) {
    console.error("Error applying promo discounts:", error);
    return booksOrBook;
  }
};

const getBooks = async (req, res) => {
  try {
    const {
      keyword,
      search,
      searchBy,
      category,
      author,
      condition,
      bookType,
      featured,
      bestseller,
      trending,
      newRelease,
      recommended,
      minPrice,
      maxPrice,
      rating,
      sort,
      filterMode, // "all" (AND) or "any" (OR)
      highDiscount,
      promo,
      offersThisWeek,
      antique,
      signed,
      vintage,
    } = req.query;

    const query = {};
    const conditions = [];
    if (!req.user?.isAdmin) {
      conditions.push({ stock: { $gt: 0 } });
    }
    const searchKeyword = keyword || search;

    let isBookWorldSearch = false;
    if (searchKeyword) {
      const normalizedKeyword = searchKeyword.toLowerCase().replace(/\s+/g, "");
      if (["bookworld", "bookworls"].includes(normalizedKeyword)) {
        isBookWorldSearch = true;
      }
    }

    // Keyword search
    if (searchKeyword && !isBookWorldSearch) {
      if (searchBy === "author") {
        const matchingAuthors = await Author.find({ name: { $regex: searchKeyword, $options: "i" } });
        const authorIds = matchingAuthors.map((a) => a._id);
        conditions.push({ author: { $in: authorIds } });
      } else if (searchBy === "publisher") {
        conditions.push({ publisher: { $regex: searchKeyword, $options: "i" } });
      } else if (searchBy === "title") {
        conditions.push({ title: { $regex: searchKeyword, $options: "i" } });
      } else {
        conditions.push({
          $or: [
            { title: { $regex: searchKeyword, $options: "i" } },
            { description: { $regex: searchKeyword, $options: "i" } },
          ],
        });
      }
    }

    // Category filter
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        if (!req.user?.isAdmin) {
          const catDoc = await Category.findById(category);
          if (!catDoc || catDoc.isActive === false) {
            conditions.push({ category: new mongoose.Types.ObjectId() });
          } else {
            conditions.push({ category });
          }
        } else {
          conditions.push({ category });
        }
      } else {
        const matchedCat = await Category.findOne({ name: { $regex: `^${category}$`, $options: "i" } });
        if (matchedCat) {
          if (!req.user?.isAdmin && matchedCat.isActive === false) {
            conditions.push({ category: new mongoose.Types.ObjectId() });
          } else {
            conditions.push({ category: matchedCat._id });
          }
        } else {
          conditions.push({ category: new mongoose.Types.ObjectId() });
        }
      }
    } else {
      if (!req.user?.isAdmin) {
        const inactiveCats = await Category.find({ isActive: false }).select("_id");
        const inactiveCatIds = inactiveCats.map((c) => c._id);
        conditions.push({ category: { $nin: inactiveCatIds } });
      }
    }

    // Author filter
    if (author) {
      if (mongoose.Types.ObjectId.isValid(author)) {
        conditions.push({ author });
      } else {
        const matchedAuth = await Author.findOne({ name: { $regex: `^${author}$`, $options: "i" } });
        if (matchedAuth) {
          conditions.push({ author: matchedAuth._id });
        } else {
          conditions.push({ author: new mongoose.Types.ObjectId() });
        }
      }
    }

    // Book condition (Used/New)
    if (condition) {
      conditions.push({ condition });
    }

    // Book type (Old/New)
    if (bookType) {
      conditions.push({ bookType });
    }

    // Badges/Flags
    if (featured === "true") {
      conditions.push({ featured: true });
    }
    if (bestseller === "true") {
      conditions.push({ bestseller: true });
    }
    if (trending === "true") {
      conditions.push({ trending: true });
    }
    if (newRelease === "true") {
      conditions.push({ newRelease: true });
    }
    if (recommended === "true") {
      conditions.push({ recommended: true });
    }
    if (offersThisWeek === "true") {
      if (!req.user?.isAdmin) {
        conditions.push({
          offersThisWeek: true,
          $or: [
            { offersThisWeekExpiry: { $exists: false } },
            { offersThisWeekExpiry: null },
            { offersThisWeekExpiry: { $gt: new Date() } }
          ]
        });
      } else {
        conditions.push({ offersThisWeek: true });
      }
    }
    if (highDiscount === "true") {
      conditions.push({ highDiscount: true });
    }
    if (antique === "true") {
      conditions.push({ antique: true });
    }
    if (signed === "true") {
      conditions.push({ signed: true });
    }
    if (vintage === "true") {
      conditions.push({ vintage: true });
    }

    // Promo filter
    if (promo === "true") {
      const settings = await Settings.findOne();
      if (settings && settings.promoSection && settings.promoSection.isActive) {
        const endsAt = settings.promoSection.endsAt;
        if (!endsAt || new Date(endsAt) > new Date()) {
          const discountBooks = settings.promoSection.discountBooks || [];
          conditions.push({ _id: { $in: discountBooks } });
        } else {
          conditions.push({ _id: new mongoose.Types.ObjectId() });
        }
      } else {
        conditions.push({ _id: new mongoose.Types.ObjectId() });
      }
    }

    // Price range filters
    if (minPrice || maxPrice) {
      const priceConditions = [];
      if (minPrice) {
        priceConditions.push({
          $or: [
            { discountedPrice: { $gte: Number(minPrice) }, originalPrice: { $gt: 0 } },
            { discountedPrice: 0, originalPrice: { $gte: Number(minPrice) } },
          ],
        });
      }
      if (maxPrice) {
        priceConditions.push({
          $or: [
            { discountedPrice: { $lte: Number(maxPrice) }, discountedPrice: { $gt: 0 } },
            { discountedPrice: 0, originalPrice: { $lte: Number(maxPrice) } },
          ],
        });
      }
      if (priceConditions.length > 0) {
        conditions.push({ $and: priceConditions });
      }
    }

    // Rating filter (averageRating >= rating)
    if (rating) {
      conditions.push({ averageRating: { $gte: Number(rating) } });
    }

    // Combine conditions
    if (conditions.length > 0) {
      if (filterMode === "any") {
        query.$or = conditions;
      } else {
        query.$and = conditions;
      }
    }

    let apiQuery = Book.find(query).populate("category").populate("author");

    // Sorting
    if (sort) {
      switch (sort) {
        case "latest":
        case "newest":
          apiQuery = apiQuery.sort({ createdAt: -1 });
          break;
        case "price-low-to-high":
        case "price_asc":
          apiQuery = apiQuery.sort({ originalPrice: 1 });
          break;
        case "price-high-to-low":
        case "price_desc":
          apiQuery = apiQuery.sort({ originalPrice: -1 });
          break;
        case "highest-rated":
        case "rating_desc":
          apiQuery = apiQuery.sort({ averageRating: -1 });
          break;
        case "most-reviewed":
          apiQuery = apiQuery.sort({ totalReviews: -1 });
          break;
        case "bestselling":
          apiQuery = apiQuery.sort({ bestseller: -1, totalReviews: -1 });
          break;
        case "title_asc":
          apiQuery = apiQuery.sort({ title: 1 });
          break;
        default:
          apiQuery = apiQuery.sort({ createdAt: -1 });
      }
    } else {
      apiQuery = apiQuery.sort({ createdAt: -1 });
    }

    const books = await apiQuery;
    let booksWithPromo = await applyPromoDiscounts(books);

    // If it's a Book World search variation, sort relevant/premium/featured/bestseller books to the top
    if (isBookWorldSearch) {
      booksWithPromo.sort((a, b) => {
        const titleMatchA = (a.title?.toLowerCase().includes("book world") || a.title?.toLowerCase().includes("bookworld")) ? 100 : 0;
        const titleMatchB = (b.title?.toLowerCase().includes("book world") || b.title?.toLowerCase().includes("bookworld")) ? 100 : 0;
        
        const scoreA = titleMatchA + (a.featured ? 10 : 0) + (a.bestseller ? 5 : 0);
        const scoreB = titleMatchB + (b.featured ? 10 : 0) + (b.bestseller ? 5 : 0);
        
        return scoreB - scoreA;
      });
    }

    res.json(booksWithPromo);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSingleBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("category")
      .populate("author");

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    if (!req.user?.isAdmin && (book.stock <= 0 || (book.category && book.category.isActive === false))) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    const bookWithPromo = await applyPromoDiscounts(book);
    res.json(bookWithPromo);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    if (req.files) {
      if (req.files.images && req.files.images.length > 0) {
        const uploaded = await uploadMultipleImages(req.files.images);
        req.body.images = uploaded.map(img => img.url);
      }
      if (req.files.newReleaseBgImage && req.files.newReleaseBgImage.length > 0) {
        const uploaded = await uploadSingleImage(req.files.newReleaseBgImage[0]);
        req.body.newReleaseBgImage = uploaded.url;
      }
    }
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    let existing = [];
    if (req.body.existingImages) {
      try {
        existing = JSON.parse(req.body.existingImages);
      } catch (err) {
        existing = Array.isArray(req.body.existingImages)
          ? req.body.existingImages
          : [req.body.existingImages];
      }
    }

    let newImages = [];
    if (req.files && req.files.images && req.files.images.length > 0) {
      const uploaded = await uploadMultipleImages(req.files.images);
      newImages = uploaded.map(img => img.url);
    }

    const isNewCover = req.body.isNewCover === "true";
    if (isNewCover) {
      req.body.images = [...newImages, ...existing];
    } else {
      req.body.images = [...existing, ...newImages];
    }

    if (req.files && req.files.newReleaseBgImage && req.files.newReleaseBgImage.length > 0) {
      const uploaded = await uploadSingleImage(req.files.newReleaseBgImage[0]);
      req.body.newReleaseBgImage = uploaded.url;
    }

    Object.assign(book, req.body);
    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    await book.deleteOne();
    res.json({ success: true, message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAdminBooksAnalytics = async (req, res) => {
  try {
    const { range } = req.query; // '7d', '30d', '6m', '1y', 'all'
    let startDate = null;

    if (range && range !== "all") {
      const now = new Date();
      if (range === "7d") {
        startDate = new Date(now.setDate(now.getDate() - 7));
      } else if (range === "30d" || range === "1m") {
        startDate = new Date(now.setMonth(now.getMonth() - 1));
      } else if (range === "6m") {
        startDate = new Date(now.setMonth(now.getMonth() - 6));
      } else if (range === "1y") {
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      }
    }

    const books = await Book.find().populate("category").populate("author");
    
    // Find all orders in date range if specified
    const orderQuery = {};
    if (startDate) {
      orderQuery.createdAt = { $gte: startDate };
    }
    const orders = await Order.find(orderQuery);

    const getBookIdStr = (bookField) => {
      if (!bookField) return "";
      if (typeof bookField === "string") return bookField;
      if (bookField._id) {
        return bookField._id.toString();
      }
      return bookField.toString();
    };

    const booksWithStats = books.map((book) => {
      if (!book || !book._id) return {};
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
        // Approximate profit at 40% margin of revenue for illustration, or equal to revenue
        totalProfit: Math.round(totalRevenue * 0.4),
      };
    });

    res.json(booksWithStats);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeaturedBooks = async (req, res) => {
  try {
    const filter = { featured: true };
    if (!req.user?.isAdmin) {
      const inactiveCats = await Category.find({ isActive: false }).select("_id");
      const inactiveCatIds = inactiveCats.map((c) => c._id);
      filter.category = { $nin: inactiveCatIds };
      filter.stock = { $gt: 0 };
    }
    const books = await Book.find(filter)
      .limit(8)
      .populate("category")
      .populate("author");
    const booksWithPromo = await applyPromoDiscounts(books);
    res.json({ success: true, books: booksWithPromo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBestSellerBooks = async (req, res) => {
  try {
    const filter = { bestseller: true };
    if (!req.user?.isAdmin) {
      const inactiveCats = await Category.find({ isActive: false }).select("_id");
      const inactiveCatIds = inactiveCats.map((c) => c._id);
      filter.category = { $nin: inactiveCatIds };
      filter.stock = { $gt: 0 };
    }
    const books = await Book.find(filter)
      .limit(8)
      .populate("category")
      .populate("author");
    const booksWithPromo = await applyPromoDiscounts(books);
    res.json({ success: true, books: booksWithPromo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getHighDiscountBooks = async (req, res) => {
  try {
    const filter = {
      highDiscount: true
    };
    if (!req.user?.isAdmin) {
      const inactiveCats = await Category.find({ isActive: false }).select("_id");
      const inactiveCatIds = inactiveCats.map((c) => c._id);
      filter.category = { $nin: inactiveCatIds };
      filter.stock = { $gt: 0 };
    }
    const books = await Book.find(filter)
      .populate("category")
      .populate("author");
    const booksWithPromo = await applyPromoDiscounts(books);
    res.json({ success: true, books: booksWithPromo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getBooks,
  getSingleBook,
  createBook,
  updateBook,
  deleteBook,
  getAdminBooksAnalytics,
  getFeaturedBooks,
  getBestSellerBooks,
  getHighDiscountBooks,
};  
