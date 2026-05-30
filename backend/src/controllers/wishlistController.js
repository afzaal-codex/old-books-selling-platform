import Wishlist from "../models/Wishlist.js";

const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: "books",
      populate: [
        { path: "category" },
        { path: "author" }
      ]
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, books: [] });
    } else if (wishlist.books) {
      wishlist.books = wishlist.books.filter(
        (book) => book && (!book.category || book.category.isActive !== false)
      );
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    if (!bookId) {
      return res.status(400).json({ success: false, message: "Book ID is required" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, books: [bookId] });
    } else {
      if (wishlist.books.some((id) => id && id.toString() === bookId)) {
        return res.status(400).json({ success: false, message: "Book already in wishlist" });
      }
      wishlist.books.push(bookId);
      await wishlist.save();
    }

    res.status(200).json({ success: true, message: "Added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    wishlist.books = wishlist.books.filter((id) => id && id.toString() !== bookId);
    await wishlist.save();

    res.status(200).json({ success: true, message: "Removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getWishlist, addToWishlist, removeFromWishlist };
