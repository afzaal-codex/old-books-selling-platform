import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    /* =========================
       BASIC INFO
    ========================= */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    author: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },

    category: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    images: [String],

    publisher: {
      type: String,
      default: "",
    },

    isbn: {
      type: String,
      default: "",
    },

    bookFormat: {
      type: String,
      default: "Paperback",
    },

    language: {
      type: String,
      default: "English",
    },

    publicationYear: {
      type: String,
      default: "",
    },

    /* =========================
       PRICING
    ========================= */

    originalPrice: {
      type: Number,
      required: true,
    },

    discountedPrice: {
      type: Number,
      default: 0,
    },

    discountPercentage: {
      type: Number,
      default: 0,
    },

    discountExpiresAt: {
      type: Date,
    },

    /* =========================
       INVENTORY
    ========================= */

    stock: {
      type: Number,
      default: 0,
    },

    /* =========================
       BOOK TYPE
    ========================= */

    bookType: {
      type: String,
      enum: ["Old", "New"],
      default: "New",
    },

    /* =========================
       OLD BOOK CONDITION
    ========================= */

    conditionDetails: {
      type: String,
      default: "",
    },

    /* =========================
       BINDING
    ========================= */

    bindingType: {
      type: String,
      enum: [
        "Hard Binding",
        "Paperback",
        "Leather Binding",
        "Spiral Binding",
      ],
      default: "Paperback",
    },

    /* =========================
       PAGES
    ========================= */

    totalPages: {
      type: Number,
      default: 0,
    },

    /* =========================
       CONDITION
    ========================= */

    condition: {
      type: String,
      enum: ["Used", "New"],
      default: "Used",
    },

    /* =========================
       FLAGS
    ========================= */

    featured: {
      type: Boolean,
      default: false,
    },

    bestseller: {
      type: Boolean,
      default: false,
    },

    trending: {
      type: Boolean,
      default: false,
    },

    newRelease: {
      type: Boolean,
      default: false,
    },

    newReleaseBgImage: {
      type: String,
      default: "",
    },

    recommended: {
      type: Boolean,
      default: false,
    },

    offersThisWeek: {
      type: Boolean,
      default: false,
    },

    offersThisWeekExpiry: {
      type: Date,
    },

    highDiscount: {
      type: Boolean,
      default: false,
    },

    antique: {
      type: Boolean,
      default: false,
    },

    signed: {
      type: Boolean,
      default: false,
    },

    signedBy: {
      type: String,
      default: "",
    },

    vintage: {
      type: Boolean,
      default: false,
    },

    showStock: {
      type: Boolean,
      default: true,
    },

    showDiscount: {
      type: Boolean,
      default: true,
    },

    /* =========================
       RATINGS
    ========================= */

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.models.Book || mongoose.model(
  "Book",
  bookSchema
);

export default Book;