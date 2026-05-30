import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { addToCart } from "../../store/slices/cartSlice";
import { toggleWishlistItem, fetchWishlist } from "../../store/slices/wishlistSlice";
import axiosInstance from "../../utils/axiosInstance";
import { Heart, Bell, ShoppingCart, Star, MessageSquare, ThumbsUp, Send, ArrowLeft } from "lucide-react";
import BookCard from "./BookCard";
import BookDetailsCard from "./BookDetailsCard";

const BackBtn = () => {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to="/books"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:       "inline-flex",
        alignSelf:     "flex-start",
        alignItems:    "center",
        gap:           6,
        fontFamily:    "system-ui, sans-serif",
        fontSize:      9,
        fontWeight:    700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color:         hov ? "#c8860a" : "#ffffff",
        background:    "#0d0d10",
        border:        `1px solid ${hov ? "#c8860a" : "#222228"}`,
        borderRadius:  0,
        padding:       "6px 12px",
        textDecoration:"none",
        transition:    "all 0.18s ease",
        marginBottom:  "12px",
      }}
    >
      <ArrowLeft size={11} strokeWidth={2.5} />
      Back to Books
    </Link>
  );
};

const BookDetailsContent = ({ book: initialBook }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [book, setBook] = useState(initialBook || {});
  const [selectedImage, setSelectedImage] = useState(initialBook?.images?.[0] || "");
  const [quantity, setQuantity] = useState(1);

  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);

  if (!initialBook || !initialBook._id) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-white bg-[#0a0a0b] p-6">
        <h2 className="text-xl font-bold">Book Not Found</h2>
        <p className="text-gray-400 mt-2 mb-4">The requested book could not be loaded.</p>
        <BackBtn />
      </div>
    );
  }

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMediaFiles, setReviewMediaFiles] = useState([]);
  const [uploadingReviewMedia, setUploadingReviewMedia] = useState(false);

  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const [authorBooks, setAuthorBooks] = useState([]);
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [activeTab, setActiveTab] = useState("author");

  const isWishlisted = wishlist?.books?.some((b) => b && (b._id || b) === book._id) || false;

  useEffect(() => {
    if (initialBook && initialBook._id) {
      setBook(initialBook);
      if (initialBook.images?.[0]) {
        setSelectedImage(initialBook.images[0]);
      } else {
        setSelectedImage("");
      }
    }
  }, [initialBook]);

  useEffect(() => {
    if (book.images?.[0]) setSelectedImage(book.images[0]);
    fetchReviews();
    if (isAuthenticated) dispatch(fetchWishlist());
  }, [book._id, isAuthenticated, dispatch]);

  useEffect(() => {
    const fetchRelatedBooks = async () => {
      try {
        const authorId = book.author?._id || book.author;
        const categoryId = book.category?._id || book.category;
        if (authorId) {
          const authorRes = await axiosInstance.get("/books", { params: { author: authorId } });
          const items = Array.isArray(authorRes.data) ? authorRes.data : [];
          setAuthorBooks(items.filter((b) => b && b._id && b._id !== book._id));
        }
        if (categoryId) {
          const categoryRes = await axiosInstance.get("/books", { params: { category: categoryId } });
          const items = Array.isArray(categoryRes.data) ? categoryRes.data : [];
          setCategoryBooks(items.filter((b) => b && b._id && b._id !== book._id));
        }
      } catch (err) {
        console.error("Failed to fetch related books:", err);
      }
    };
    fetchRelatedBooks();
  }, [book._id]);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await axiosInstance.get(`/reviews/book/${book._id}`);
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleAddToCartClick = () => {
    dispatch(addToCart({ book, quantity }));
    toast.success(`${quantity} x "${book.title}" added to cart!`);
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ book, quantity }));
    navigate("/cart");
  };

  const handleWishlistClick = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      navigate("/login", { state: { from: location } });
      return;
    }
    try {
      await dispatch(toggleWishlistItem({ bookId: book._id, inWishlist: isWishlisted })).unwrap();
      dispatch(fetchWishlist());
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      toast.error(typeof error === "string" ? error : (error.message || "Failed to update wishlist"));
    }
  };

  const handleNotificationClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to enable notifications");
      navigate("/login", { state: { from: location } });
      return;
    }
    setNotificationEnabled(!notificationEnabled);
    toast.success(
      notificationEnabled
        ? "Stock notifications disabled"
        : "Stock notifications enabled! We will notify you when stock changes."
    );
  };

  const handleReviewMediaChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (reviewMediaFiles.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 files.");
      return;
    }
    try {
      setUploadingReviewMedia(true);
      const formData = new FormData();
      files.forEach((file) => formData.append("media", file));
      const res = await axiosInstance.post("/reviews/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success && res.data.files) {
        setReviewMediaFiles((prev) => [...prev, ...res.data.files]);
        toast.success("Review media uploaded successfully!");
      } else {
        toast.error("Failed to upload review media");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload media");
    } finally {
      setUploadingReviewMedia(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to leave a review");
      navigate("/login", { state: { from: location } });
      return;
    }
    if (!newComment.trim()) {
      toast.error("Review comment cannot be empty");
      return;
    }
    if (newRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    try {
      setSubmittingReview(true);
      const images = reviewMediaFiles.filter((f) => f.resourceType === "image").map((f) => f.url);
      const videos = reviewMediaFiles.filter((f) => f.resourceType === "video").map((f) => f.url);
      const res = await axiosInstance.post("/reviews", {
        bookId: book._id,
        rating: newRating,
        comment: newComment,
        images,
        videos,
      });
      toast.success(res.data.message || "Review added!");
      setNewComment("");
      setNewRating(0);
      setReviewMediaFiles([]);
      fetchReviews();
      const updatedBookRes = await axiosInstance.get(`/books/${book._id}`);
      setBook(updatedBookRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReplySubmit = async (reviewId) => {
    if (!isAuthenticated) {
      toast.error("Please login to reply to reviews");
      navigate("/login", { state: { from: location } });
      return;
    }
    if (!replyText.trim()) {
      toast.error("Reply text cannot be empty");
      return;
    }
    try {
      setSubmittingReply(true);
      await axiosInstance.post(`/reviews/${reviewId}/replies`, { comment: replyText });
      toast.success("Reply added!");
      setReplyText("");
      setReplyingToId(null);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleLikeReview = async (reviewId) => {
    if (!isAuthenticated) {
      toast.error("Please login to like reviews");
      navigate("/login", { state: { from: location } });
      return;
    }
    try {
      await axiosInstance.post(`/reviews/${reviewId}/like`);
      fetchReviews();
    } catch (error) {
      console.error("Failed to like review", error);
    }
  };

  const highlightKeywords = (text) => {
    if (!text) return "";
    const keywords = [
      "first edition", "rare", "collectible", "hardcover", "paperback",
      "mint condition", "used", "original", "pages", "condition", "author", "publisher",
    ];
    const regex = new RegExp(`\\b(${keywords.join("|")})\\b`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="text-[#c8860a] font-semibold">{part}</span>
      ) : (
        part
      )
    );
  };

  const hasDiscount = book.discountedPrice > 0 && book.discountedPrice < book.originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((book.originalPrice - book.discountedPrice) / book.originalPrice) * 100)
    : 0;

  return (
    <div className="text-white bg-[var(--color-bg)] py-3" style={{ display: "flex", flexDirection: "column" }}>
      <BackBtn />

      {/* SECTION 1: BOOK DETAILS */}
      <BookDetailsCard
        book={book}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        quantity={quantity}
        setQuantity={setQuantity}
        hasDiscount={hasDiscount}
        discountPercentage={discountPercentage}
        isWishlisted={isWishlisted}
        handleWishlistClick={handleWishlistClick}
        notificationEnabled={notificationEnabled}
        handleNotificationClick={handleNotificationClick}
        handleBuyNow={handleBuyNow}
        handleAddToCartClick={handleAddToCartClick}
        reviewsLength={reviews.length}
      />

      {/* SECTION 2: DESCRIPTION HEADING */}
      <h3
        style={{
          fontFamily: "'Satoshi', sans-serif",
          fontWeight: 700,
          color: "#fff",
          fontSize: "clamp(15px, 1.8vw, 20px)",
          letterSpacing: "-0.01em",
          lineHeight: 1.25,
          margin: "18px 0 3px 0",
          padding: 0,
        }}
      >
        Book Description
      </h3>

      {/* SECTION 2: DESCRIPTION BODY */}
      <div
        style={{
          width: "100%",
          margin: "3px 0",
          padding: "8px 16px",
          background: "#050505",
          border: "1px solid #1e1e1e",
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            fontFamily: "'Satoshi', sans-serif",
            color: "#fff",
            fontSize: "13px",
            lineHeight: 1.7,
            whiteSpace: "pre-line",
            margin: 0,
          }}
        >
          {highlightKeywords(book.description) || "No description provided for this literary copy."}
        </p>
      </div>

      {/* SECTION 3: READER FEEDBACK HEADING */}
      <h3
        style={{
          fontFamily: "'Satoshi', sans-serif",
          fontWeight: 700,
          color: "#fff",
          fontSize: "clamp(15px, 1.8vw, 20px)",
          letterSpacing: "-0.01em",
          lineHeight: 1.25,
          margin: "18px 0 3px 0",
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        Reader Feedback
        <span style={{ fontSize: "11px", fontWeight: 500, color: "#6b7280", letterSpacing: "0" }}>
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </span>
      </h3>

      {/* SECTION 3: READER FEEDBACK BOX */}
      <section
        style={{
          background: "#050505",
          border: "1px solid #1e1e1e",
          borderRadius: 0,
          margin: "3px 0",
          width: "100%",
          boxSizing: "border-box",
        }}
      >

        {/* 2-column body */}
        <div
          className="flex flex-col lg:grid lg:grid-cols-[1fr_320px]"
        >
          {/* ── LEFT: REVIEWS LIST ── */}
          <div
            className="border-t lg:border-t-0 lg:border-r border-[#141414] order-2 lg:order-1"
            style={{
              padding: "8px 16px",
              /* CHANGED: scrollable when reviews overflow */
              maxHeight: "520px",
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#2a2a2a #0d0d0d",
            }}
          >
            {loadingReviews ? (
              <p style={{ fontSize: "10px", color: "#4b4b4b", padding: "20px 0" }}>
                Loading reviews…
              </p>
            ) : reviews.length === 0 ? (
              /* CHANGED: empty state text white */
              <p
                style={{
                  fontSize: "10px",
                  color: "#fff",
                  padding: "24px 0",
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                No reviews yet. Be the first to share your thoughts.
              </p>
            ) : (
              <div>
                {reviews.map((rev, idx) => (
                  <div
                    key={rev._id}
                    style={{
                      padding: "12px 0",
                      borderBottom: idx < reviews.length - 1 ? "1px solid #141414" : "none",
                    }}
                  >
                    {/* Name + Date */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#fff" }}>
                        {rev.user?.name || "Anonymous"}
                      </span>
                      {/* CHANGED: date color white */}
                      <span style={{ fontSize: "9px", color: "#fff" }}>
                        {new Date(rev.createdAt).toLocaleDateString("en-PK", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Stars — CHANGED: empty stars white stroke */}
                    <div style={{ display: "flex", gap: "2px", marginBottom: "6px" }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={9}
                          fill={rev.rating >= s ? "#eab308" : "none"}
                          stroke={rev.rating >= s ? "#eab308" : "#ffffff"}
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>

                    {/* Comment */}
                    <p style={{ fontSize: "11px", color: "#9ca3af", lineHeight: 1.65, marginBottom: "8px" }}>
                      {rev.comment}
                    </p>

                    {/* Media thumbnails */}
                    {((rev.images && rev.images.length > 0) || (rev.videos && rev.videos.length > 0)) && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
                        {rev.images?.map((imgUrl, imgIdx) => (
                          <a key={imgIdx} href={imgUrl} target="_blank" rel="noopener noreferrer">
                            <img
                              src={imgUrl}
                              alt=""
                              style={{ width: "44px", height: "44px", objectFit: "cover", border: "1px solid #1e1e1e", display: "block" }}
                            />
                          </a>
                        ))}
                        {rev.videos?.map((vidUrl, vidIdx) => (
                          <video
                            key={vidIdx}
                            src={vidUrl}
                            controls
                            style={{ width: "72px", height: "44px", objectFit: "cover", background: "#000", border: "1px solid #1e1e1e" }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Like + Reply — CHANGED: default color white */}
                    <div style={{ display: "flex", gap: "14px", borderTop: "1px solid #111", paddingTop: "8px" }}>
                      <button
                        onClick={() => handleLikeReview(rev._id)}
                        style={{
                          display: "flex", alignItems: "center", gap: "4px",
                          fontSize: "9px", color: "#fff", background: "none",
                          border: "none", cursor: "pointer", padding: 0,
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = "#c8860a"}
                        onMouseLeave={e => e.currentTarget.style.color = "#fff"}
                      >
                        <ThumbsUp size={10} />
                        Like {rev.likes?.length > 0 && `(${rev.likes.length})`}
                      </button>
                      <button
                        onClick={() => setReplyingToId(replyingToId === rev._id ? null : rev._id)}
                        style={{
                          display: "flex", alignItems: "center", gap: "4px",
                          fontSize: "9px", color: "#fff", background: "none",
                          border: "none", cursor: "pointer", padding: 0,
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = "#c8860a"}
                        onMouseLeave={e => e.currentTarget.style.color = "#fff"}
                      >
                        <MessageSquare size={10} />
                        Reply {rev.replies?.length > 0 && `(${rev.replies.length})`}
                      </button>
                    </div>

                    {/* Replies */}
                    {rev.replies && rev.replies.length > 0 && (
                      <div
                        style={{
                          marginTop: "8px",
                          paddingLeft: "10px",
                          borderLeft: "1px solid #1e1e1e",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        {rev.replies.map((reply, repIdx) => (
                          <div key={repIdx}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                              <span style={{ fontSize: "9px", fontWeight: 700, color: "#c8860a" }}>
                                {reply.user?.name}
                              </span>
                              <span style={{ fontSize: "8px", color: "#3a3a3a" }}>
                                {new Date(reply.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p style={{ fontSize: "10px", color: "#9ca3af", lineHeight: 1.5 }}>
                              {reply.comment}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply input */}
                    {replyingToId === rev._id && (
                      <div style={{ display: "flex", gap: "6px", marginTop: "8px", alignItems: "center" }}>
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply…"
                          style={{
                            flex: 1,
                            background: "#0d0d0d",
                            border: "1px solid #262626",
                            padding: "6px 10px",
                            fontSize: "10px",
                            color: "#fff",
                            outline: "none",
                            borderRadius: 0,
                          }}
                        />
                        <button
                          onClick={() => handleReplySubmit(rev._id)}
                          disabled={submittingReply}
                          style={{
                            background: "#c8860a",
                            border: "none",
                            padding: "6px 8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 0,
                            flexShrink: 0,
                          }}
                        >
                          <Send size={10} color="#000" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: WRITE REVIEW ── */}
          <div
            className="order-1 lg:order-2"
            style={{ padding: "8px 16px", background: "#030303" }}
          >
            {/* CHANGED: title-style font for "Write Your Review" */}
            <span
              style={{
                display: "block",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-0.01em",
                lineHeight: 1.25,
                fontSize: "clamp(13px, 1.5vw, 17px)",
                marginBottom: "12px",
              }}
            >
              Write Your Review
            </span>

            <form onSubmit={handleReviewSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

              {/* Star Rating */}
              <div>
                <span style={{ fontSize: "8px", color: "#4b4b4b", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "5px" }}>
                  Rating
                </span>
                {/* CHANGED: empty stars white stroke */}
                <div style={{ display: "flex", gap: "4px" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewRating(s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "1px", transition: "transform 0.1s" }}
                    >
                      <Star
                        size={16}
                        fill={(hoverRating || newRating) >= s ? "#c8860a" : "none"}
                        stroke={(hoverRating || newRating) >= s ? "#c8860a" : "#ffffff"}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea — CHANGED: "Your Thoughts" label white */}
              <div>
                <span style={{ fontSize: "8px", color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "5px" }}>
                  Your Thoughts
                </span>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your reading experience…"
                  style={{
                    width: "100%",
                    background: "#fff",
                    color: "#111",
                    border: "1px solid #d1d1d1",
                    padding: "14px",
                    fontSize: "11px",
                    fontFamily: "inherit",
                    lineHeight: 1.6,
                    resize: "none",
                    outline: "none",
                    borderRadius: 0,
                    minHeight: "150px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Upload */}
              <div>
                <span style={{ fontSize: "8px", color: "#4b4b4b", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "5px" }}>
                  Add Photos / Videos (Max 5)
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleReviewMediaChange}
                  disabled={uploadingReviewMedia || reviewMediaFiles.length >= 5}
                  style={{
                    width: "100%",
                    background: "#0d0d0d",
                    border: "1px solid #1e1e1e",
                    padding: "6px 8px",
                    fontSize: "9px",
                    color: "#6b7280",
                    cursor: "pointer",
                    outline: "none",
                    borderRadius: 0,
                    boxSizing: "border-box",
                  }}
                />
                {uploadingReviewMedia && (
                  <p style={{ fontSize: "8px", color: "#c8860a", marginTop: "4px" }}>Uploading…</p>
                )}
                {reviewMediaFiles.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
                    {reviewMediaFiles.map((file, idx) => (
                      <div key={idx} style={{ position: "relative", width: "40px", height: "40px", background: "#000", border: "1px solid #1e1e1e", flexShrink: 0 }}>
                        {file.resourceType === "image" ? (
                          <img src={file.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <video src={file.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                        <button
                          type="button"
                          onClick={() => setReviewMediaFiles((prev) => prev.filter((_, i) => i !== idx))}
                          style={{
                            position: "absolute", top: "-6px", right: "-6px",
                            background: "#dc2626", color: "#fff", border: "none",
                            width: "14px", height: "14px", fontSize: "9px",
                            cursor: "pointer", display: "flex", alignItems: "center",
                            justifyContent: "center", borderRadius: "50%", lineHeight: 1,
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit — CHANGED: title-style font */}
              <button
                type="submit"
                disabled={submittingReview}
                style={{
                  width: "100%",
                  background: submittingReview ? "#a86f08" : "#c8860a",
                  border: "1px solid #c8860a",
                  color: "#000",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  fontSize: "clamp(11px, 1.2vw, 14px)",
                  lineHeight: 1.25,
                  padding: "9px 10px",
                  cursor: submittingReview ? "not-allowed" : "pointer",
                  borderRadius: 0,
                  marginTop: "2px",
                }}
                onMouseEnter={e => { if (!submittingReview) e.currentTarget.style.background = "#a86f08"; }}
                onMouseLeave={e => { if (!submittingReview) e.currentTarget.style.background = "#c8860a"; }}
              >
                {submittingReview ? "Posting…" : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* AUTHOR BIO CARD */}
      {book.author && (
        <div
          style={{
            width: "100%",
            margin: "18px 0 3px 0",
            padding: "16px",
            background: "#050505",
            border: "1px solid #1e1e1e",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <h3
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 700,
              color: "#fff",
              fontSize: "clamp(14px, 1.6vw, 18px)",
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
              margin: 0,
            }}
          >
            About the Author: {book.author.name}
          </h3>
          <p
            style={{
              fontFamily: "'Satoshi', sans-serif",
              color: "#9ca3af",
              fontSize: "12.5px",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {book.author.bio || "No biography available for this author."}
          </p>
        </div>
      )}

      {/* RELATED BOOKS HEADING & SWITCHER TABS — aligned in one row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "nowrap",
          gap: "16px",
          margin: "18px 0 12px 0",
          width: "100%",
        }}
      >
        <h3
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontWeight: 700,
            color: "#fff",
            fontSize: "clamp(15px, 1.8vw, 20px)",
            letterSpacing: "-0.01em",
            lineHeight: 1.25,
            margin: 0,
            padding: 0,
          }}
        >
          {activeTab === "author"
            ? `More Books by ${book.author?.name || "this Author"}`
            : `More Books in ${book.category?.name || "this Category"}`}
        </h3>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("category")}
            className="flex items-center justify-center flex-shrink-0 font-semibold tracking-wide cursor-pointer whitespace-nowrap transition-colors duration-200"
            style={{
              fontSize: "13px",
              padding: "0 14px",
              height: "42px",
              background: "transparent",
              border: activeTab === "category" ? "1px solid #c8860a" : "1px solid rgba(255,255,255,0.4)",
              color: activeTab === "category" ? "#c8860a" : "#d1d5db",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "#c8860a";
              e.currentTarget.style.borderColor = "#c8860a";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = activeTab === "category" ? "#c8860a" : "#d1d5db";
              e.currentTarget.style.borderColor = activeTab === "category" ? "#c8860a" : "rgba(255,255,255,0.4)";
            }}
          >
            More books by this category
          </button>
          <button
            onClick={() => setActiveTab("author")}
            className="flex items-center justify-center flex-shrink-0 font-semibold tracking-wide cursor-pointer whitespace-nowrap transition-colors duration-200"
            style={{
              fontSize: "13px",
              padding: "0 14px",
              height: "42px",
              background: "transparent",
              border: activeTab === "author" ? "1px solid #c8860a" : "1px solid rgba(255,255,255,0.4)",
              color: activeTab === "author" ? "#c8860a" : "#d1d5db",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "#c8860a";
              e.currentTarget.style.borderColor = "#c8860a";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = activeTab === "author" ? "#c8860a" : "#d1d5db";
              e.currentTarget.style.borderColor = activeTab === "author" ? "#c8860a" : "rgba(255,255,255,0.4)";
            }}
          >
            More books by this author
          </button>
        </div>
      </div>

      {/* RELATED BOOKS LIST */}
      <section
        style={{
          margin: "3px 0",
          width: "100%",
          boxSizing: "border-box",
          background: "transparent",
          padding: "0 0 16px 0",
        }}
      >
        {activeTab === "author" ? (
          authorBooks.length === 0 ? (
            <p className="text-xs text-gray-500 italic bg-black p-4 text-center rounded-none">
              No other books by this author
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {authorBooks.map((b) => (
                <BookCard key={b._id} book={b} />
              ))}
            </div>
          )
        ) : (
          categoryBooks.length === 0 ? (
            <p className="text-xs text-gray-500 italic bg-black p-4 text-center rounded-none">
              No other books in this category
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {categoryBooks.map((b) => (
                <BookCard key={b._id} book={b} />
              ))}
            </div>
          )
        )}
      </section>

    </div>
  );
};

export default BookDetailsContent;