import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    orderItems: [
      {
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },

        title: String,

        image: String,

        quantity: Number,

        price: Number,
      },
    ],

    shippingAddress: {
      fullName: String,

      city: String,

      address: String,

      phone: String,

      email: String,
    },

    paymentMethod: {
      type: String,
      enum: [
        "JazzCash",
        "EasyPaisa",
        "Bank Transfer",
        "COD",
      ],
    },

    paymentStatus: {
      type: String,
      default: "Pending",
    },

    orderStatus: {
      type: String,
      default: "Pending Payment Verification",
    },

    deliveryCharges: {
      type: Number,
      default: 0,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    couponDiscount: {
      type: Number,
      default: 0,
    },

    orderNumber: {
      type: String,
      unique: true,
      sparse: true, // Allow temporary null if needed, but we will generate pre-save
    },

    assignedEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    processingNotes: {
      type: String,
      default: "",
    },

    deliveryNotes: {
      type: String,
      default: "",
    },

    approvalNotes: {
      type: String,
      default: "",
    },

    internalNotes: {
      type: String,
      default: "",
    },

    transactionId: {
      type: String,
      default: "",
    },

    paymentScreenshot: {
      type: String,
      default: "",
    },

    timeline: [
      {
        status: {
          type: String,
          required: true,
        },
        notes: {
          type: String,
          default: "",
        },
        actionDate: {
          type: Date,
          default: Date.now,
        },
        actionBy: {
          type: String, // String representation of user/system
          default: "System",
        },
      },
    ],

    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;