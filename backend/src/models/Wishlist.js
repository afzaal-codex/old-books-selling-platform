import mongoose from "mongoose";

const wishlistSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      books: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },
      ],
    },
    {
      timestamps: true,
    }
  );

const Wishlist = mongoose.models.Wishlist || mongoose.model(
    "Wishlist",
    wishlistSchema
  );

export default Wishlist;