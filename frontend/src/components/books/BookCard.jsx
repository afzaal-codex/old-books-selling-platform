import { Heart, ShoppingCart, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import toast from "react-hot-toast";
import { addToCart } from "../../store/slices/cartSlice";
import { toggleWishlistItem, fetchWishlist } from "../../store/slices/wishlistSlice";

const BookCard = ({ book, noBorder }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { settings } = useSelector((state) => state.cms);
  const showStockSetting = settings?.showStock !== false;
  const isWishlisted = wishlist?.books?.some((b) => b && (b._id || b) === book._id) || false;

  const hasDiscount = book.discountedPrice > 0 && book.discountedPrice < book.originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((book.originalPrice - book.discountedPrice) / book.originalPrice) * 100)
    : 0;
  const savings = hasDiscount ? book.originalPrice - book.discountedPrice : 0;

  const handleWishlist = async (e) => {
    e?.preventDefault(); e?.stopPropagation();
    if (!isAuthenticated) { toast.error("Please login to save items to wishlist"); navigate("/login"); return; }
    try {
      await dispatch(toggleWishlistItem({ bookId: book._id, inWishlist: isWishlisted })).unwrap();
      dispatch(fetchWishlist());
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      toast.error(typeof error === "string" ? error : (error.message || "Failed to update wishlist"));
    }
  };

  const handleAddToCart = (e) => {
    e?.preventDefault(); e?.stopPropagation();
    dispatch(addToCart({ book, quantity: 1 }));
    toast.success(`"${book.title}" added to cart!`);
  };

  const handleShare = (e) => {
    e?.preventDefault(); e?.stopPropagation();
    const bookUrl = `${window.location.origin}/book/${book._id}`;
    if (navigator.share) {
      navigator.share({ title: book.title, text: `Check out "${book.title}" on BookWorld!`, url: bookUrl }).catch(console.log);
    } else {
      navigator.clipboard.writeText(bookUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <div
      className="group flex flex-col overflow-visible transition-all duration-300 hover:translate-y-[-4px]"
      style={{
        background: "#0d0d0d",
        border: noBorder ? "none" : "1px solid #9ca3af",
        borderRadius: "6px",
       
        transform: "perspective(800px) rotateX(1deg)",
        transformStyle: "preserve-3d",
      }}
    >

      {/* ── TOP TAGS ROW — only Bestseller & Featured ── */}
      <div
        className="flex flex-row items-center gap-1"
        style={{ padding: "6px 8px 4px 8px", minHeight: "24px" }}
      >
        {book.bestseller && (
          <span
            className="font-extrabold text-white uppercase"
            style={{
              background: "#6d28d9",
              fontSize: "8px",
              padding: "3px 6px",
              borderRadius: "2px",
              letterSpacing: "0.1em",
            }}
          >
            Bestseller
          </span>
        )}
        {book.featured && (
          <span
            className="font-extrabold text-black uppercase"
            style={{
              background: "#c8860a",
              fontSize: "8px",
              padding: "3px 6px",
              borderRadius: "2px",
              letterSpacing: "0.1em",
            }}
          >
            Featured
          </span>
        )}
      </div>

      {/*
        ── IMAGE TAPE ──
        Margins (% of card width via padding on parent):
          top    = 8%  of card  → paddingTop on wrapper
          bottom = 3%  of card  → paddingBottom on wrapper
          left   = 5%  of card  → paddingLeft (book leans left)
          right  = 10% of card  → paddingRight (sinks right)

        Image is scaled down 20% from current size.
        Current: fills 100% of (card - 4px*2 margins).
        New:     fills 80% of that area → achieved by adding more
                 horizontal room (left 5% + right 10% = 15% total h-padding,
                 was 4px+4px ≈ ~4% total).
        The asymmetric left/right padding creates the "leaning left, sinking right" feel.
      *)
      */}
      <div
        className="relative"
        style={{
          paddingTop:    "8%",
          paddingBottom: "3%",
          paddingLeft:   "13%",
          paddingRight:  "13%",
        }}
      >
        {/* Circular discount badge — anchored to top-left of the padded image area */}
        {hasDiscount && (
          <div
            className="absolute z-20 flex flex-col items-center justify-center"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #cc2200, #ff4422)",
              border: "2px solid #0d0d0d",
              boxShadow: "0 2px 8px rgba(204,34,0,0.6)",
              /* sit at top-left corner of the padded image box */
              top: "calc(8% - 17px)",
              left: "calc(13% - 17px)",
              lineHeight: 1,
              zIndex: 20,
            }}
          >
            <span style={{ fontSize: "11px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>
              -{discountPercentage}%
            </span>
          </div>
        )}

        {/* Image tape: fills the padded area with strict 2:3 ratio */}
        <Link
          to={`/book/${book._id}`}
          className="block overflow-hidden"
          style={{
            borderRadius: "4px",
            width: "100%",
            aspectRatio: "2 / 3",
            display: "block",
            background: "#0a0a0a",
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
            flexShrink: 0,
          }}
        >
          {book.images && book.images.length > 0 ? (
            <div className="relative w-full h-full" style={{ aspectRatio: "2 / 3" }}>
              <img
                src={book.images[activeImgIdx]}
                alt={book.title}
                className="transition duration-500 group-hover:scale-105"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                  borderRadius: "4px",
                }}
              />
              {book.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault(); e.stopPropagation();
                      setActiveImgIdx((prev) => (prev === 0 ? book.images.length - 1 : prev - 1));
                    }}
                    className="absolute left-1 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/90 text-white rounded-full p-1 border border-neutral-800 transition opacity-0 group-hover:opacity-100"
                    style={{ cursor: "pointer", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault(); e.stopPropagation();
                      setActiveImgIdx((prev) => (prev === book.images.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/90 text-white rounded-full p-1 border border-neutral-800 transition opacity-0 group-hover:opacity-100"
                    style={{ cursor: "pointer", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <ChevronRight size={12} />
                  </button>
                  {/* Indicator dots */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 z-30 bg-black/45 px-1.5 py-0.5 rounded-full">
                    {book.images.slice(0, 10).map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-1 h-1 rounded-full transition-all ${
                          idx === activeImgIdx ? "bg-[var(--color-primary)] scale-125" : "bg-neutral-500"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#4b5563",
                fontSize: "11px",
                fontStyle: "italic",
              }}
            >
              No Image
            </div>
          )}
        </Link>
      </div>

      {/* ── CONTENT ── */}
      <div className="flex flex-col flex-1" style={{ padding: "0 8px 0 8px" }}>

        {/* CATEGORY & CONDITION */}
        <div
          className="flex items-center gap-1 uppercase tracking-wider"
          style={{ fontSize: "8px", paddingTop: "2px" }}
        >
          <span style={{ color: "#c8860a", fontWeight: 500 }}>{book.category?.name || "Genre"}</span>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
          <span style={{ color: "#9ca3af", fontWeight: 500 }}>{book.condition || "New"}</span>
        </div>

        {/* TITLE */}
        <Link to={`/book/${book._id}`} style={{ marginTop: "3px" }}>
          <h2
            className="line-clamp-1 hover:text-[#c8860a] transition duration-200"
            style={{
              fontSize: "clamp(13px, 2.5vw, 18px)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.25,
            }}
          >
            {book.title}
          </h2>
        </Link>

        {/* AUTHOR */}
        <div style={{ marginTop: "2px" }}>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>By </span>
          {book.author && typeof book.author === "object" && book.author.slug ? (
            <Link
              to={`/author/${book.author.slug}`}
              className="hover:underline"
              style={{ fontSize: "clamp(11px, 2vw, 15px)", color: "#c8860a", fontWeight: 700 }}
            >
              {book.author.name}
            </Link>
          ) : (
            <span style={{ fontSize: "clamp(11px, 2vw, 15px)", color: "#c8860a", fontWeight: 700 }}>
              {book.author?.name || book.author || "Unknown"}
            </span>
          )}
        </div>

        {book.signed && (
          <div style={{ fontSize: "10px", color: "#c8860a", fontWeight: 750, marginTop: "2px", display: "flex", alignItems: "center", gap: "3px" }}>
            <span>✍️ Signed by:</span>
            <span style={{ color: "#ffffff" }}>{book.signedBy || "Author"}</span>
          </div>
        )}

        {/* DIVIDER */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />

        {/* PRICING */}
        <div className="flex flex-col" style={{ gap: "1px" }}>
          {hasDiscount ? (
            <>
              <div className="flex items-baseline gap-1 flex-wrap">
                <span style={{ fontSize: "clamp(11px, 2vw, 13px)", fontWeight: 900, color: "#ffffff" }}>
                  Rs. {book.discountedPrice}
                </span>
                <span style={{ fontSize: "9px", color: "red", textDecoration: "line-through" }}>
                  Rs. {book.originalPrice}
                </span>
              </div>
              <span style={{ fontSize: "9px", color: "gray", fontWeight: 600 }}>
                Save Rs. {savings}
              </span>
            </>
          ) : (
            <span style={{ fontSize: "clamp(11px, 2vw, 13px)", fontWeight: 900, color: "#ffffff" }}>
              Rs. {book.originalPrice}
            </span>
          )}
        </div>

        {/* DIVIDER */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />

        {/* STOCK */}
        {showStockSetting && (
          <div className="flex items-center gap-1 flex-wrap" style={{ marginBottom: "4px" }}>
            {book.stock <= 0 ? (
              <span
                style={{
                  fontSize: "8px", fontWeight: 700, color: "#ef4444",
                  background: "rgba(239,68,68,0.1)", padding: "2px 5px",
                  borderRadius: "2px", border: "1px solid rgba(239,68,68,0.3)",
                }}
              >
                Out of Stock
              </span>
            ) : (
              <>
                <span
                  style={{
                    fontSize: "8px", fontWeight: 700, color: "white",
                    background: "#c8860a", padding: "2px 5px",
                    borderRadius: "2px", border: "1px solid #c8860a",
                  }}
                >
                  In Stock
                </span>
                {book.stock <= 5 && (
                  <span style={{ fontSize: "8px", color: "#22c55e", fontWeight: 600 }}>
                    Only {book.stock} left
                  </span>
                )}
              </>
            )}
          </div>
        )}

      </div>

      {/* GOLDEN DIVIDER */}
      <div style={{ height: "1px", background: "rgba(200,134,10,0.25)", width: "100%" }} />

      {/* ── ACTIONS ── */}
      <div
        className="flex items-center justify-end"
        style={{ padding: "6px 8px", gap: "12px" }}
      >
        <button
          type="button"
          onClick={handleShare}
          title="Share Book"
          className="relative z-30 inline-flex h-7 w-7 items-center justify-center transition-all duration-200 text-gray-500 hover:text-[#c8860a] [transform:translate3d(0,0,10px)] hover:[transform:translate3d(0,0,10px)_scale(1.12)]"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", userSelect: "none", WebkitAppearance: "none", appearance: "none" }}
        >
          <Share2 size={14} style={{ pointerEvents: "none" }} />
        </button>

        <button
          type="button"
          onClick={handleWishlist}
          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
          className={`relative z-30 inline-flex h-7 w-7 items-center justify-center transition-all duration-200 [transform:translate3d(0,0,10px)] hover:[transform:translate3d(0,0,10px)_scale(1.12)] ${
            isWishlisted ? "text-red-500" : "text-gray-500 hover:text-red-500"
          }`}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", userSelect: "none", WebkitAppearance: "none", appearance: "none" }}
        >
          <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} style={{ pointerEvents: "none" }} />
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={book.stock <= 0}
          title="Add to Cart"
          className={`relative z-30 inline-flex h-7 w-7 items-center justify-center transition-all duration-200 [transform:translate3d(0,0,10px)] hover:[transform:translate3d(0,0,10px)_scale(1.12)] ${
            book.stock <= 0 ? "text-neutral-700" : "text-[#c8860a] hover:text-[#dda020]"
          }`}
          style={{
            background: "none", border: "none", padding: 0,
            cursor: book.stock <= 0 ? "not-allowed" : "pointer",
            userSelect: "none",
            WebkitAppearance: "none",
            appearance: "none"
          }}
        >
          <ShoppingCart size={14} style={{ pointerEvents: "none" }} />
        </button>
      </div>
    </div>
  );
};

export default BookCard;
