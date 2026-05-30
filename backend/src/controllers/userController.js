import User from "../models/User.js";
import Book from "../models/Book.js";
import Order from "../models/Order.js";
import Wishlist from "../models/Wishlist.js";
import Review from "../models/Review.js";
import Category from "../models/Category.js";
import { sendBrandedEmail } from "../services/mailService.js";

const getUsers = async (req, res) => {
  const users = await User.find().select("-password");

  res.json(users);
};

const getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
};

const blockUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.isBlocked = true;
  user.blocked = true;

  await user.save();

  res.json({
    success: true,
    message: "User blocked",
  });
};

const unblockUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.isBlocked = false;
  user.blocked = false;

  await user.save();

  res.json({
    success: true,
    message: "User unblocked",
  });
};

const getUserInterestsExport = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    const books = await Book.find().select("category").lean();
    const orders = await Order.find().lean();
    const wishlists = await Wishlist.find().lean();
    const reviews = await Review.find().lean();
    const categories = await Category.find().lean();

    // Map category ID to category name
    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat._id.toString()] = cat.name;
    });

    // Map book ID to category ID
    const bookCategoryMap = {};
    books.forEach((b) => {
      if (b.category) {
        bookCategoryMap[b._id.toString()] = b.category.toString();
      }
    });

    const exportData = users.map((user) => {
      const categoryCounts = {};
      const userIdStr = user._id.toString();

      // 1. Order History Weighting (weight 3 per quantity purchased)
      const userOrders = orders.filter((o) => o.user && o.user.toString() === userIdStr);
      userOrders.forEach((order) => {
        order.orderItems.forEach((item) => {
          if (item.book) {
            const catId = bookCategoryMap[item.book.toString()];
            if (catId) {
              categoryCounts[catId] = (categoryCounts[catId] || 0) + (item.quantity || 1) * 3;
            }
          }
        });
      });

      // 2. Wishlist Weighting (weight 2 per wishlisted book)
      const userWishlist = wishlists.find((w) => w.user && w.user.toString() === userIdStr);
      if (userWishlist && userWishlist.books) {
        userWishlist.books.forEach((bookId) => {
          const catId = bookCategoryMap[bookId.toString()];
          if (catId) {
            categoryCounts[catId] = (categoryCounts[catId] || 0) + 2;
          }
        });
      }

      // 3. Review Weighting (weight 1 per reviewed book)
      const userReviews = reviews.filter((r) => r.user && r.user.toString() === userIdStr);
      userReviews.forEach((rev) => {
        if (rev.book) {
          const catId = bookCategoryMap[rev.book.toString()];
          if (catId) {
            categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
          }
        }
      });

      // Find top category
      let maxCount = 0;
      let interestedCategoryId = null;
      Object.entries(categoryCounts).forEach(([catId, count]) => {
        if (count > maxCount) {
          maxCount = count;
          interestedCategoryId = catId;
        }
      });

      const interestedCategory = interestedCategoryId
        ? (categoryMap[interestedCategoryId] || "General")
        : "General";

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        interestedCategory,
      };
    });

    res.json(exportData);
  } catch (error) {
    res.status(550).json({ success: false, message: error.message });
  }
};

const sendBulkEmail = async (req, res) => {
  try {
    const { emails, subject, body } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ success: false, message: "No recipient emails provided" });
    }
    if (!subject || !body) {
      return res.status(400).json({ success: false, message: "Subject and Body/Message are required" });
    }

    const emailPromises = emails.map(async (email) => {
      try {
        await sendBrandedEmail({
          to: email,
          subject,
          bodyHtml: `<div style="font-size: 14px; color: #ffffff; line-height: 1.6; background-color: #000000; padding: 10px;">${body.replace(/\n/g, "<br/>")}</div>`,
        });
        return { email, success: true };
      } catch (err) {
        console.error(`Failed to send email to ${email}:`, err.message);
        return { email, success: false, error: err.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const sentCount = results.filter((r) => r.success).length;

    res.json({
      success: true,
      message: `Successfully sent ${sentCount} of ${emails.length} emails.`,
      results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getUsers,
  getSingleUser,
  blockUser,
  unblockUser,
  getUserInterestsExport,
  sendBulkEmail,
};