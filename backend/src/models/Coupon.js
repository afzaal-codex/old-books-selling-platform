import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
    },

    minOrderAmount: {
      type: Number,
      default: 0,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    usageLimit: {
      type: Number,
      default: 1,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);

export default Coupon;