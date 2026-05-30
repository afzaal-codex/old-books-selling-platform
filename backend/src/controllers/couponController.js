import Coupon from "../models/Coupon.js";

const getCoupons = async (req, res) => {
  const coupons = await Coupon.find();

  res.json(coupons);
};

const createCoupon = async (req, res) => {
  const coupon = await Coupon.create(req.body);

  res.status(201).json(coupon);
};

const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  await coupon.deleteOne();

  res.json({
    success: true,
    message: "Coupon deleted",
  });
};

const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon code" });
    }

    if (!coupon.active) {
      return res.status(400).json({ success: false, message: "Coupon is inactive" });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ success: false, message: "Coupon has expired" });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
    }

    if (orderAmount && orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of Rs. ${coupon.minOrderAmount} is required for this coupon`
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon validated successfully",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      }
    });
  } catch (error) {
    res.status(550).json({ success: false, message: error.message });
  }
};

export {
  getCoupons,
  createCoupon,
  deleteCoupon,
  validateCoupon,
};