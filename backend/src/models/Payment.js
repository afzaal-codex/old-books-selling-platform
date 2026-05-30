import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    transactionId: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    screenshot: {
      type: String,
      default: "",
    },

    verificationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    adminNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;