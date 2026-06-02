import { Link } from "react-router-dom";
import { Star, ShoppingCart, Heart, Bell } from "lucide-react";
import { useSelector } from "react-redux";

const BookDetailsCard = ({
  book,
  selectedImage,
  setSelectedImage,
  quantity,
  setQuantity,
  hasDiscount,
  discountPercentage,
  isWishlisted,
  handleWishlistClick,
  notificationEnabled,
  handleNotificationClick,
  handleBuyNow,
  handleAddToCartClick,
  reviewsLength,
}) => {
  const { settings } = useSelector((state) => state.cms);
  const showStockSetting = (settings?.showStock !== false) && (book.showStock !== false);
  const showDiscountSetting = book.showDiscount !== false;
  return (
    <div
      className="w-full text-white"
      style={{
        background: "#050505",
        border: "1px solid #1e1e1e",
        padding: "3px",
        borderRadius: 0,
        display: "grid",
        gridTemplateColumns: "1fr",
      }}
    >
      <div className="flex flex-col md:flex-row gap-0 w-full">

        {/* ── COLUMN 1: IMAGE ── */}
        <div
          className="flex-shrink-0 select-none w-full md:w-[28.3%]"
          style={{ background: "#000" }}
        >
          {/* Main Image */}
          <div
            className="relative flex items-center justify-center"
            style={{ aspectRatio: "4/4", background: "#000", padding: "8px" }}
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={book.title}
                className="max-h-[260px] object-contain"
                style={{ borderRadius: 0 }}
              />
            ) : (
              <span
                className="text-gray-600 uppercase tracking-widest font-mono"
                style={{ fontSize: "10px" }}
              >
                No Image
              </span>
            )}

            {/* TAGS ON THE LEFT */}
            <div className="absolute top-0 left-0 flex flex-col items-start gap-1 z-10">
              {hasDiscount && showDiscountSetting && (
                <div
                  className="text-white font-black"
                  style={{
                    background: "#cc2200",
                    fontSize: "8px",
                    padding: "3px 7px",
                    letterSpacing: "0.08em",
                    borderRadius: 0,
                  }}
                >
                  -{discountPercentage}% OFF
                </div>
              )}
              {hasDiscount && discountPercentage >= 15 && (
                <div
                  className="text-white font-extrabold uppercase"
                  style={{
                    background: "#b91c1c",
                    fontSize: "8px",
                    padding: "3px 7px",
                    letterSpacing: "0.08em",
                    borderRadius: 0,
                  }}
                >
                  High Discount
                </div>
              )}
            </div>

            {/* TAGS ON THE RIGHT */}
            <div className="absolute top-0 right-0 flex flex-col items-end gap-1 z-10">
              {book.featured && (
                <div
                  className="font-extrabold text-black uppercase"
                  style={{
                    background: "#c8860a",
                    fontSize: "8px",
                    padding: "3px 7px",
                    letterSpacing: "0.08em",
                    borderRadius: 0,
                  }}
                >
                  Featured
                </div>
              )}
              {book.bestseller && (
                <div
                  className="font-extrabold text-white uppercase"
                  style={{
                    background: "#6d28d9",
                    fontSize: "8px",
                    padding: "3px 7px",
                    letterSpacing: "0.08em",
                    borderRadius: 0,
                  }}
                >
                  Bestseller
                </div>
              )}
            </div>


          </div>

          {/* Thumbnails */}
          {book.images && book.images.length > 1 && (
            <div
              className="flex gap-1 overflow-x-auto py-1 px-2"
              style={{ borderTop: "1px solid #1a1a1a" }}
            >
              {book.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className="flex-shrink-0 transition-all duration-150 cursor-pointer"
                  style={{
                    width: "44px",
                    height: "44px",
                    border: selectedImage === img
                      ? "1px solid #c8860a"
                      : "1px solid #262626",
                    borderRadius: 0,
                    padding: 0,
                    background: "transparent",
                  }}
                >
                  <img
                    src={img}
                    alt={`thumb-${idx}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── COLUMN 2: INFO ── */}
        <div
          className="flex flex-col w-full md:flex-1"
          style={{
            padding: "10px 16px",
            gap: "8px",
          }}
        >
          {/* Category & Condition */}
          <div className="flex items-center gap-1.5" style={{ fontSize: "8px" }}>
            <span
              className="uppercase tracking-widest font-semibold"
              style={{ color: "#c8860a" }}
            >
              {book.category?.name || "Genre"}
            </span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <span
              className="uppercase tracking-widest font-medium"
              style={{ color: "#6b7280" }}
            >
              {book.condition || "New"}
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-bold text-white leading-tight"
            style={{
              fontSize: "clamp(17px, 2.2vw, 22px)",
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
              marginTop: "-2px",
            }}
          >
            {book.title}
          </h1>

          {/* Author */}
          <div style={{ marginTop: "-4px" }}>
            <span style={{ fontSize: "10px", color: "#6b7280" }}>By </span>
            {book.author && typeof book.author === "object" && book.author.slug ? (
              <Link
                to={`/author/${book.author.slug}`}
                className="hover:underline font-bold"
                style={{ fontSize: "11px", color: "#c8860a" }}
              >
                {book.author.name}
              </Link>
            ) : (
              <span className="font-bold" style={{ fontSize: "11px", color: "#c8860a" }}>
                {book.author?.name || book.author || "Unknown"}
              </span>
            )}
            {book.signed && (
              <div style={{ fontSize: "11.5px", color: "#c8860a", fontWeight: 750, marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <span>✍️ Signed Copy by:</span>
                <span style={{ color: "#ffffff" }}>{book.signedBy || "Author"}</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #1a1a1a" }} />

          {/* Pricing */}
          <div className="flex flex-col" style={{ gap: "2px" }}>
            <div className="flex items-baseline gap-2">
              <span className="font-bold" style={{ fontSize: "20px", color: "#c8860a" }}>
                Rs. {hasDiscount ? book.discountedPrice : book.originalPrice}
              </span>
              {hasDiscount && showDiscountSetting && (
                <span
                  className="line-through"
                  style={{ fontSize: "11px", color: "#6b7280" }}
                >
                  Rs. {book.originalPrice}
                </span>
              )}
            </div>
            {hasDiscount && showDiscountSetting && (
              <span
                className="font-semibold"
                style={{ fontSize: "10px", color: "#22c55e" }}
              >
                You Save Rs. {book.originalPrice - book.discountedPrice} ({discountPercentage}% Off)
              </span>
            )}
          </div>

          {/* Stock Status */}
          {showStockSetting && (
            <div>
              {book.stock <= 0 ? (
                <span
                  style={{
                    fontSize: "8px",
                    fontWeight: 700,
                    color: "#ef4444",
                    background: "rgba(239,68,68,0.08)",
                    padding: "2px 6px",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: 0,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Out of Stock
                </span>
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    style={{
                      fontSize: "8px",
                      fontWeight: 700,
                      color: "#fff",
                      background: "rgba(34,197,94,0.06)",
                      padding: "2px 6px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 0,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    In Stock
                  </span>
                  {book.stock <= 5 ? (
                    <span
                      className="animate-pulse uppercase font-extrabold"
                      style={{ fontSize: "9px", color: "#ef4444", letterSpacing: "0.04em" }}
                    >
                      Only {book.stock} Left
                    </span>
                  ) : (
                    <span
                      className="font-semibold"
                      style={{ fontSize: "9px", color: "#6b7280" }}
                    >
                      Ready to Ship
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Condition Notes */}
          {book.conditionDetails && book.condition?.toLowerCase() === "old" && (
            <div
              style={{
                background: "#0d0d0d",
                border: "1px solid #1e1e1e",
                padding: "8px 10px",
              }}
            >
              <span
                className="uppercase font-bold tracking-wider block"
                style={{ fontSize: "7px", color: "#c8860a", marginBottom: "3px" }}
              >
                Condition Notes
              </span>
              <p
                className="italic"
                style={{ fontSize: "10px", color: "#9ca3af", lineHeight: 1.5 }}
              >
                &ldquo;{book.conditionDetails}&rdquo;
              </p>
            </div>
          )}


          <div className="flex flex-col gap-2">
            {/* Specifications */}
            <div style={{ background: "#000", padding: "8px 10px" }}>
              <span
                className="uppercase font-extrabold tracking-wider block"
                style={{ fontSize: "7px", color: "#c8860a", marginBottom: "6px" }}
              >
                Specifications
              </span>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {[
                    ["Pages", book.totalPages || "N/A"],
                    ["Binding", book.bindingType || "N/A"],
                    ["Publisher", book.publisher || "N/A"],
                    ["Format", book.bookFormat || "Paperback"],
                    ["Language", book.language || "English"],
                    ["Year", book.publicationYear || "N/A"],
                  ].map(([label, value], i, arr) => (
                    <tr
                      key={label}
                      style={{
                        borderBottom: i < arr.length - 1 ? "1px solid #141414" : "none",
                      }}
                    >
                      <td
                        style={{
                          fontSize: "11.5px",
                          color: "#6b7280",
                          padding: "3px 0",
                          width: "45%",
                        }}
                      >
                        {label}
                      </td>
                      <td
                        style={{
                          fontSize: "11.5px",
                          color: "#fff",
                          fontWeight: 600,
                          padding: "3px 0",
                          textAlign: "right",
                        }}
                      >
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ratings */}
            <div
              className="flex items-center gap-2"
              style={{ background: "#000", padding: "6px 10px" }}
            >
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={10} fill="currentColor" />
                <span
                  className="font-bold text-white"
                  style={{ fontSize: "11px", marginLeft: "2px" }}
                >
                  {book.averageRating || "0.0"}
                </span>
              </div>
              <span style={{ color: "#2a2a2a" }}>|</span>
              <span style={{ fontSize: "10px", color: "#6b7280" }}>
                {reviewsLength} Reviews
              </span>
            </div>
          </div>
        </div>

        {/* ── COLUMN 3: ACTIONS ── */}
        <div
          className="flex items-center justify-center flex-shrink-0 w-full md:w-[22%]"
          style={{ padding: "10px 12px" }}
        >
          <div className="flex flex-col w-full" style={{ gap: "8px" }}>

          {/* Quantity */}
          {book.stock > 0 && (
            <div
              className="flex items-center justify-between"
              style={{
                background: "#000",
                border: "1px solid #1e1e1e",
                padding: "6px 10px",
              }}
            >
              <span style={{ fontSize: "10px", color: "#6b7280" }}>Qty</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex items-center justify-center font-bold text-white cursor-pointer transition-colors duration-100 hover:bg-neutral-800"
                  style={{
                    width: "22px",
                    height: "22px",
                    border: "1px solid #262626",
                    fontSize: "13px",
                    background: "transparent",
                    borderRadius: 0,
                  }}
                >
                  −
                </button>
                <span
                  className="font-bold text-white text-center"
                  style={{ fontSize: "12px", minWidth: "16px" }}
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                  className="flex items-center justify-center font-bold text-white cursor-pointer transition-colors duration-100 hover:bg-neutral-800"
                  style={{
                    width: "22px",
                    height: "22px",
                    border: "1px solid #262626",
                    fontSize: "13px",
                    background: "transparent",
                    borderRadius: 0,
                  }}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div
            className="grid grid-cols-2 md:flex md:flex-col"
            style={{ gap: "6px" }}
          >
            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              disabled={book.stock <= 0}
              className="flex items-center justify-center font-extrabold uppercase tracking-wider transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed w-full"
              style={{
                fontSize: "10px",
                padding: "8px 10px",
                background: "#1d4ed8",
                border: "1px solid #2563eb",
                color: "#fff",
                borderRadius: 0,
                letterSpacing: "0.07em",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#1e40af")}
              onMouseLeave={e => (e.currentTarget.style.background = "#1d4ed8")}
            >
              Buy Now
            </button>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCartClick}
              disabled={book.stock <= 0}
              className="flex items-center justify-center gap-1.5 font-extrabold uppercase tracking-wider transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed w-full"
              style={{
                fontSize: "10px",
                padding: "8px 10px",
                background: "#c8860a",
                border: "1px solid #c8860a",
                color: "#000",
                borderRadius: 0,
                letterSpacing: "0.07em",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#a86f08")}
              onMouseLeave={e => (e.currentTarget.style.background = "#c8860a")}
            >
              <ShoppingCart size={11} />
              Add to Cart
            </button>

            {/* Wishlist */}
            <button
              onClick={handleWishlistClick}
              className="flex items-center justify-center gap-1.5 font-extrabold uppercase tracking-wider transition-all duration-150 cursor-pointer w-full"
              style={{
                fontSize: "10px",
                padding: "8px 10px",
                background: isWishlisted ? "#c8860a" : "#fff",
                border: isWishlisted ? "1px solid #c8860a" : "1px solid #fff",
                color: "#000",
                borderRadius: 0,
                letterSpacing: "0.07em",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isWishlisted ? "#a86f08" : "#e5e5e5";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isWishlisted ? "#c8860a" : "#fff";
              }}
            >
              <Heart size={11} fill={isWishlisted ? "currentColor" : "none"} />
              {isWishlisted ? "Saved" : "Wishlist"}
            </button>

            {/* Stock Alert */}
            {showStockSetting && (
              <button
                onClick={handleNotificationClick}
                className="flex items-center justify-center gap-1.5 font-extrabold uppercase tracking-wider transition-all duration-150 cursor-pointer w-full"
                style={{
                  fontSize: "10px",
                  padding: "8px 10px",
                  background: notificationEnabled ? "#059669" : "#dc2626",
                  border: notificationEnabled ? "1px solid #10b981" : "1px solid #ef4444",
                  color: "#fff",
                  borderRadius: 0,
                  letterSpacing: "0.07em",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = notificationEnabled ? "#047857" : "#b91c1c";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = notificationEnabled ? "#059669" : "#dc2626";
                }}
              >
                <Bell size={11} />
                {notificationEnabled ? "Alert On" : "Stock Alert"}
              </button>
            )}
          </div>

          {/* Subtle note */}
          <p
            className="text-center"
            style={{ fontSize: "8px", color: "#3a3a3a", marginTop: "2px" }}
          >
            Secure checkout · Genuine books
          </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default BookDetailsCard;