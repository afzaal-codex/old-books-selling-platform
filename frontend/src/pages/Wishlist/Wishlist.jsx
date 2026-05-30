import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "../../store/slices/wishlistSlice";
import { Link } from "react-router-dom";
import PageLoader from "../../components/loaders/PageLoader";
import { Heart, ArrowRight, BookHeart, Package } from "lucide-react";
import BookCard from "../../components/books/BookCard";
import SeoHead from "../../components/common/SeoHead";

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const T = {
  bg:         "#0a0a0b",
  card:       "#111114",
  hover:      "#16161a",
  border:     "#222228",
  gold:       "#c8860a",
  text:       "#f0ede8",
  muted:      "#6b6870",
  dim:        "#44424a",
  success:    "#10b981",
  danger:     "#ef4444",
  dangerBg:   "#1a0808",
  dangerBdr:  "#3d1010",
};

const s = {
  label: {
    fontFamily: "system-ui, sans-serif",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: T.muted,
  },
};



/* ─── Loading Spinner ────────────────────────────────────────────────────── */
const Spinner = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
    <div style={{
      width: 28, height: 28,
      border: `1px solid ${T.border}`,
      borderTop: `1px solid ${T.gold}`,
      borderRadius: "50%",
      animation: "wl-spin 0.7s linear infinite",
    }} />
    <style>{`@keyframes wl-spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* ─── Empty State ────────────────────────────────────────────────────────── */
const EmptyState = () => {
  const [btnHov, setBtnHov] = useState(false);
  return (
      <SeoHead page="Wishlist" />
      <div style={{
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      gap:            12,
      padding:        "56px 24px",
      background:     T.card,
      border:         `1px dashed ${T.border}`,
      borderRadius:   0,
    }}>
      <Heart size={36} color={T.dim} strokeWidth={1.5} />
      <div style={{ textAlign: "center" }}>
        <p style={{
          fontFamily:   "system-ui, sans-serif",
          fontSize:     14,
          fontWeight:   800,
          color:        T.muted,
          letterSpacing:"-0.01em",
          margin:       "0 0 4px",
        }}>
          Your wishlist is empty
        </p>
        <p style={{
          fontFamily: "system-ui, sans-serif",
          fontSize:   11,
          color:      T.dim,
          margin:     "0 0 20px",
        }}>
          Save books you love and come back to them anytime.
        </p>
      </div>
      <Link
        to="/books"
        onMouseEnter={() => setBtnHov(true)}
        onMouseLeave={() => setBtnHov(false)}
        style={{
          fontFamily:   "system-ui, sans-serif",
          fontSize:     10,
          fontWeight:   800,
          textTransform:"uppercase",
          letterSpacing:"0.07em",
          padding:      "9px 20px",
          background:   btnHov ? "#b07808" : T.gold,
          color:        "#000",
          borderRadius: 0,
          textDecoration:"none",
          display:      "flex",
          alignItems:   "center",
          gap:          6,
          transition:   "all 0.18s ease",
          border:       "none",
        }}
      >
        Find Books <ArrowRight size={12} strokeWidth={2.5} />
      </Link>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const Wishlist = () => {
  const dispatch  = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const wishlistBooks = wishlist?.books || [];

  return (
      <SeoHead page="Wishlist" />
      <div style={{
      background:   T.bg,
      minHeight:    "100%",
      padding:      "0 0 48px",
      fontFamily:   "system-ui, sans-serif",
    }}>

      {/* ── Page Header — cart-header eyebrow style ── */}
      <div style={{
        paddingBottom: 28,
        borderBottom:  `1px solid ${T.border}`,
        marginBottom:  28,
      }}>
        {/* Eyebrow */}
        <div style={{
          display:       "flex",
          alignItems:    "center",
          gap:           7,
          fontSize:      11,
          fontWeight:    600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color:         T.gold,
          marginBottom:  10,
          fontFamily:    "system-ui, sans-serif",
        }}>
          <BookHeart size={11} color={T.gold} strokeWidth={2} />
          Your Saved Books
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily:   "system-ui, sans-serif",
          fontSize:     "clamp(26px, 4vw, 36px)",
          fontWeight:   800,
          color:        T.text,
          lineHeight:   1.15,
          margin:       "0 0 6px",
          letterSpacing:"-0.01em",
        }}>
          My Wishlist
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: "system-ui, sans-serif",
          fontSize:   13,
          color:      T.muted,
          margin:     0,
        }}>
          Your saved books and reading plans.
        </p>
      </div>

      {/* ── Body ── */}
      {loading && !wishlist ? (
        <PageLoader label="Loading Wishlist" />
      ) : wishlistBooks.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Count badge */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{
              display:       "inline-flex",
              alignItems:    "center",
              gap:           5,
              fontSize:      11,
              fontWeight:    600,
              color:         T.muted,
              background:    T.card,
              border:        `1px solid ${T.border}`,
              borderRadius:  0,
              padding:       "3px 9px",
              fontFamily:    "system-ui, sans-serif",
            }}>
              <Package size={11} color={T.muted} strokeWidth={2} />
              {wishlistBooks.length} {wishlistBooks.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Grid */}
          <div style={{
            display:             "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap:                 16,
          }}
            className="wl-grid"
          >
            {wishlistBooks.map((book) => (
              <BookCard
                key={book._id}
                book={book}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Responsive grid breakpoints ── */}
      <style>{`
        @media (max-width: 1024px) {
          .wl-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .wl-grid { grid-template-columns: 1fr !important; gap: 12px !important; }
        }
      `}</style>
    </div>
  );
};

export default Wishlist;