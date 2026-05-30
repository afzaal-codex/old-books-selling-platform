import Settings from "../models/Settings.js";
import Book from "../models/Book.js";
import Category from "../models/Category.js";
import Author from "../models/Author.js";
import Coupon from "../models/Coupon.js";
import { verifyAdminOtp } from "./adminSecurityController.js";

const getSettings = async (req, res) => {
  let settings = await Settings.findOne()
    .populate("heroSection.category")
    .populate({
      path: "heroSection.books",
      populate: [
        { path: "author", model: "Author" },
        { path: "category", model: "Category" },
      ]
    })
    .populate({
      path: "promoSection.discountBooks",
      populate: [
        { path: "author", model: "Author" },
        { path: "category", model: "Category" },
      ]
    });

  if (!settings) {
    settings = await Settings.create({});
  }

  res.json(settings);
};

const updateSettings = async (req, res) => {
  const { adminOtp, adminMatchNumber, ...settingsPayload } = req.body;
  const email = (req.user?.email || process.env.ADMIN_EMAIL || "").toLowerCase();

  try {
    await verifyAdminOtp({
      email,
      purpose: "cms-update",
      otp: adminOtp,
      matchNumber: adminMatchNumber,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }

  // Synchronize Promo Coupon in database
  if (settingsPayload.promoSection) {
    const { promoCode, discountValue, endsAt, isActive } = settingsPayload.promoSection;
    if (promoCode) {
      const uppercaseCode = promoCode.toUpperCase();
      const expiryDate = endsAt ? new Date(endsAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await Coupon.findOneAndUpdate(
        { code: uppercaseCode },
        {
          code: uppercaseCode,
          discountType: "percentage",
          discountValue: Number(discountValue) || 40,
          expiryDate,
          active: isActive !== false,
          usageLimit: 999999,
        },
        { upsert: true, new: true }
      );
    }
  }

  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create(settingsPayload);
  } else {
    Object.assign(settings, settingsPayload);
    settings = await settings.save();
  }

  settings = await Settings.findById(settings._id)
    .populate("heroSection.category")
    .populate({
      path: "heroSection.books",
      populate: [
        { path: "author", model: "Author" },
        { path: "category", model: "Category" },
      ]
    })
    .populate({
      path: "promoSection.discountBooks",
      populate: [
        { path: "author", model: "Author" },
        { path: "category", model: "Category" },
      ]
    });

  res.json(settings);
};

export {
  getSettings,
  updateSettings,
};
