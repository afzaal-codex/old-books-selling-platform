import mongoose from "mongoose";

const reviewSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      book: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
      },

      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },

      comment: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        enum: ["Pending", "Approved", "Hidden", "Featured"],
        default: "Approved",
      },

      replies: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],

      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      images: [
        {
          type: String,
        },
      ],

      videos: [
        {
          type: String,
        },
      ],
    },
    {
      timestamps: true,
    }
  );

const Review = mongoose.models.Review || mongoose.model(
    "Review",
    reviewSchema
  );

export default Review;