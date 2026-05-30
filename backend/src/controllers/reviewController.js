import Review from "../models/Review.js";
import Book from "../models/Book.js";
import { uploadToCloudinary } from "../services/cloudinaryService.js";
import Notification from "../models/Notification.js";

/* =========================
   CREATE REVIEW
========================= */

const createReview =
  async (req, res) => {

    try {

      const {
        bookId,
        rating,
        comment,
        images,
        videos,
      } = req.body;

      /* VALIDATION */

      if (
        !bookId ||
        !rating
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Book and rating are required",
        });
      }

      /* BOOK EXISTS */

      const book =
        await Book.findById(
          bookId
        );

      if (!book) {
        return res.status(404).json({
          success: false,
          message:
            "Book not found",
        });
      }

      /* ALREADY REVIEWED */

      const alreadyReviewed =
        await Review.findOne({
          user: req.user._id,
          book: bookId,
        });

      if (alreadyReviewed) {
        return res.status(400).json({
          success: false,
          message:
            "You already reviewed this book",
        });
      }

      /* CREATE */

      const review =
        await Review.create({
          user: req.user._id,

          book: bookId,

          rating,

          comment,

          images: images || [],

          videos: videos || [],
        });

      /* UPDATE BOOK */

      const reviews =
        await Review.find({
          book: bookId,
        });

      const totalRatings =
        reviews.reduce(
          (acc, item) =>
            acc +
            item.rating,
          0
        );

      const averageRating =
        totalRatings /
        reviews.length;

      book.averageRating =
        averageRating.toFixed(1);

      book.totalReviews =
        reviews.length;

      await book.save();

      // Create admin notification for new review
      try {
        await Notification.create({
          title: "New Review Posted",
          message: `User ${req.user.name} posted a ${rating}-star review on book "${book.title}".`,
          type: "system"
        });
      } catch (notifErr) {
        console.error("Failed to create review notification:", notifErr.message);
      }

      /* RESPONSE */

      res.status(201).json({
        success: true,
        message:
          "Review added successfully",
        review,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/* =========================
   GET REVIEWS OF SINGLE BOOK
========================= */

const getBookReviews =
  async (req, res) => {

    try {

      const reviews =
        await Review.find({
          book:
            req.params.bookId,
        })
          .populate(
            "user",
            "name"
          )
          .populate({
            path: "replies.user",
            select: "name"
          })
          .sort({
            createdAt: -1,
          });

      res.json({
        success: true,
        totalReviews:
          reviews.length,
        reviews,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/* =========================
   DELETE REVIEW
========================= */

const deleteReview =
  async (req, res) => {

    try {

      const review =
        await Review.findById(
          req.params.id
        );

      if (!review) {
        return res.status(404).json({
          success: false,
          message:
            "Review not found",
        });
      }

      /* ONLY OWNER */

      if (
        review.user.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Access denied",
        });
      }

      const bookId =
        review.book;

      await review.deleteOne();

      /* RECALCULATE */

      const reviews =
        await Review.find({
          book: bookId,
        });

      const book =
        await Book.findById(
          bookId
        );

      if (book) {

        if (
          reviews.length === 0
        ) {

          book.averageRating = 0;

          book.totalReviews = 0;

        } else {

          const totalRatings =
            reviews.reduce(
              (
                acc,
                item
              ) =>
                acc +
                item.rating,
              0
            );

          book.averageRating =
            (
              totalRatings /
              reviews.length
            ).toFixed(1);

          book.totalReviews =
            reviews.length;
        }

        await book.save();
      }

      res.json({
        success: true,
        message:
          "Review deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

const replyToReview = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ success: false, message: "Comment is required" });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    review.replies.push({
      user: req.user._id,
      comment,
      createdAt: new Date()
    });

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate("user", "name")
      .populate("replies.user", "name");

    res.status(200).json({ success: true, message: "Reply added", review: updatedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    const userId = req.user._id.toString();
    const index = review.likes.findIndex((id) => id.toString() === userId);

    if (index === -1) {
      review.likes.push(req.user._id);
    } else {
      review.likes.splice(index, 1);
    }

    await review.save();
    res.status(200).json({ success: true, likes: review.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminUpdateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !["Pending", "Approved", "Hidden", "Featured"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    review.status = status;
    await review.save();

    res.status(200).json({ success: true, message: `Review status updated to ${status}`, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminGetReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("book", "title images")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminDeleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    const bookId = review.book;
    await review.deleteOne();

    // Recalculate book ratings
    const reviews = await Review.find({ book: bookId });
    const book = await Book.findById(bookId);
    if (book) {
      if (reviews.length === 0) {
        book.averageRating = 0;
        book.totalReviews = 0;
      } else {
        const totalRatings = reviews.reduce((acc, item) => acc + item.rating, 0);
        book.averageRating = (totalRatings / reviews.length).toFixed(1);
        book.totalReviews = reviews.length;
      }
      await book.save();
    }

    res.status(200).json({ success: true, message: "Review deleted by admin" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadReviewMediaFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files provided" });
    }

    const urls = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, "reviews");
      urls.push({
        url: result.secure_url,
        resourceType: result.resource_type, // 'image' or 'video'
      });
    }

    res.json({ success: true, files: urls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createReview,
  getBookReviews,
  deleteReview,
  replyToReview,
  likeReview,
  adminUpdateReviewStatus,
  adminGetReviews,
  adminDeleteReview,
  uploadReviewMediaFiles,
};