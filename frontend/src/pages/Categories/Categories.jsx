import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/slices/categorySlice";
import { Link } from "react-router-dom";
import { BookOpen, LayoutGrid } from "lucide-react";
import PageLoader from "../../components/loaders/PageLoader";

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const T = {
  bg:     "#0a0a0b",
  card:   "#111114",
  border: "#222228",
  gold:   "#c8860a",
  text:   "#f0ede8",
  muted:  "#6b6870",
  dim:    "#44424a",
};

/* ─── Category Item ──────────────────────────────────────────────────────── */
const CategoryItem = ({ cat }) => {
  const [hov, setHov] = useState(false);

  return (
    <Link
      to={`/category/${cat.slug}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        gap:            10,
        textDecoration: "none",
        cursor:         "pointer",
        transition:     "all 0.18s ease",
      }}
    >
      {/* Circular image / fallback */}
      <div style={{
        width:        96,
        height:       96,
        borderRadius: "50%",
        overflow:     "hidden",
        flexShrink:   0,
        transition:   "all 0.18s ease",
        transform:    hov ? "scale(1.06)" : "scale(1)",
        filter:       hov ? "brightness(1.12)" : "brightness(1)",
      }}>
        {cat.image ? (
          <img
            src={cat.image}
            alt={cat.name}
            style={{
              width:      "100%",
              height:     "100%",
              objectFit:  "cover",
              display:    "block",
              borderRadius: "50%",
            }}
          />
        ) : (
          <div style={{
            width:          "100%",
            height:         "100%",
            borderRadius:   "50%",
            background:     T.card,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
          }}>
            <BookOpen size={28} color={T.gold} strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Category name */}
      <span style={{
        fontFamily:   "system-ui, sans-serif",
        fontSize:     12,
        fontWeight:   700,
        color:        hov ? T.gold : T.text,
        textAlign:    "center",
        lineHeight:   1.3,
        letterSpacing:"-0.01em",
        transition:   "color 0.18s ease",
        maxWidth:     100,
      }}>
        {cat.name}
      </span>

      {/* Optional book count */}
      {cat.bookCount > 0 && (
        <span style={{
          fontFamily:    "system-ui, sans-serif",
          fontSize:      8,
          fontWeight:    700,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color:         T.dim,
          marginTop:     -4,
        }}>
          {cat.bookCount} Books
        </span>
      )}
    </Link>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const Categories = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) return <PageLoader label="Loading Categories" />;

  return (
    <div style={{ background: T.bg, fontFamily: "system-ui, sans-serif", paddingBottom: 48 }}>

      {/* ── Page Header — cart-header eyebrow style ── */}
      <div style={{ paddingBottom: 28, borderBottom: `1px solid ${T.border}`, marginBottom: 40 }}>
        {/* Eyebrow */}
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: T.gold,
          marginBottom: 10, fontFamily: "system-ui, sans-serif",
        }}>
          <LayoutGrid size={11} color={T.gold} strokeWidth={2} />
          Browse by Genre
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
          Categories
        </h1>
        {/* Subtitle */}
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: T.muted, margin: 0 }}>
          Browse books by your favorite literary genres.
        </p>
      </div>

      {/* ── Category grid ── */}
      <div
        className="cat-grid"
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap:                 "32px 24px",
          justifyItems:        "center",
        }}
      >
        {categories.map((cat) => (
          <CategoryItem key={cat._id} cat={cat} />
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) { .cat-grid { grid-template-columns: repeat(4, 1fr) !important; } }
        @media (max-width: 768px)  { .cat-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 480px)  { .cat-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px 16px !important; } }
      `}</style>
    </div>
  );
};

export default Categories;