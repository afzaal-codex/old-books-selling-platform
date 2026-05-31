import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import BookCard from "../../components/books/BookCard";
import { ArrowLeft, BookOpen, LayoutGrid } from "lucide-react";
import PageLoader from "../../components/loaders/PageLoader";

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const T = {
  bg:     "#0a0a0b",
  card:   "#111114",
  border: "#222228",
  gold:   "#c8860a",
  text:   "#f0ede8",
  muted:  "#DCDCDC",
  dim:    "#44424a",
};

const s = {
  label: {
    fontFamily:    "system-ui, sans-serif",
    fontSize:      9,
    fontWeight:    700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color:         T.muted,
  },
};

/* ─── Back Button ────────────────────────────────────────────────────────── */
const BackBtn = () => {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to="/categories"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:       "inline-flex",
        alignItems:    "center",
        gap:           6,
        fontFamily:    "system-ui, sans-serif",
        fontSize:      9,
        fontWeight:    700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color:         hov ? T.gold : "#ffffff",
        background:    "#0d0d10",
        border:        `1px solid ${hov ? T.gold : T.border}`,
        borderRadius:  0,
        padding:       "6px 12px",
        textDecoration:"none",
        transition:    "all 0.18s ease",
      }}
    >
      <ArrowLeft size={11} strokeWidth={2.5} />
      Back to Categories
    </Link>
  );
};

/* ─── Spinner ────────────────────────────────────────────────────────────── */
const Spinner = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
    <div style={{
      width: 28, height: 28,
      border: `1px solid ${T.border}`,
      borderTop: `1px solid ${T.gold}`,
      borderRadius: "50%",
      animation: "cd-spin 0.7s linear infinite",
    }} />
    <style>{`@keyframes cd-spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* ─── Empty State ────────────────────────────────────────────────────────── */
const EmptyState = ({ catName }) => {
  const [hov, setHov] = useState(false);
  return (
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
      <BookOpen size={32} color={T.dim} strokeWidth={1.5} />
      <div style={{ textAlign: "center" }}>
        <p style={{
          fontFamily:   "system-ui, sans-serif",
          fontSize:     13, fontWeight: 800,
          color:        T.muted, letterSpacing: "-0.01em",
          margin:       "0 0 4px",
        }}>
          No books found in {catName}
        </p>
        <p style={{ ...s.label, fontSize: 8, color: T.dim, marginBottom: 16 }}>
          This collection hasn't been stocked yet
        </p>
      </div>
      <Link
        to="/categories"
        onMouseEnter={e => { e.currentTarget.style.background = "#b07808"; }}
        onMouseLeave={e => { e.currentTarget.style.background = T.gold; }}
        style={{
          fontFamily:    "system-ui, sans-serif",
          fontSize:      10, fontWeight: 800,
          textTransform: "uppercase", letterSpacing: "0.08em",
          padding:       "8px 18px",
          background:    T.gold, color: "#000",
          borderRadius:  0, border: "none",
          textDecoration:"none",
          transition:    "all 0.18s ease",
          display:       "flex", alignItems: "center", gap: 6,
        }}
      >
        <LayoutGrid size={11} strokeWidth={2.5} />
        Explore Other Categories
      </Link>
    </div>
  );
};

/* ─── Hero Section ───────────────────────────────────────────────────────── */
const CategoryHero = ({ category, bookCount }) => {
  const [imgHov, setImgHov] = useState(false);
  return (
    <div style={{
      background:    T.card,
      border:        `1px solid ${T.border}`,
      borderRadius:  0,
      padding:       "28px 32px",
      display:       "flex",
      flexWrap:      "wrap",
      justifyContent:"space-between",
      alignItems:    "center",
      gap:           24,
      marginBottom:  1,
    }}>
      {/* Left: info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, minWidth: 0 }}>
        <BackBtn />

        {/* Eyebrow */}
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: T.gold,
          fontFamily: "system-ui, sans-serif",
        }}>
          <LayoutGrid size={11} color={T.gold} strokeWidth={2} />
          Literary Genre
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily:   "system-ui, sans-serif",
          fontSize:     "clamp(22px, 3.5vw, 34px)",
          fontWeight:   800,
          color:        T.text,
          lineHeight:   1.15,
          letterSpacing:"-0.01em",
          margin:       0,
        }}>
          {category.name}
        </h1>

        {/* Subtitle */}
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: T.muted, margin: 0 }}>
          Browse and explore genre highlights
        </p>

        {/* Meta strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap", marginTop: 4 }}>
          <span style={{
            ...s.label, fontSize: 8,
            color:        T.gold,
            padding:      "4px 10px",
            border:       `1px solid ${T.border}`,
            background:   "#0d0d10",
            borderRadius: 0,
          }}>
            {bookCount} {bookCount === 1 ? "Book" : "Books"} Available
          </span>
          <span style={{
            ...s.label, fontSize: 8,
            padding:      "4px 10px",
            border:       `1px solid ${T.border}`,
            borderLeft:   "none",
            background:   "#0d0d10",
            borderRadius: 0,
          }}>
            Curated Collection
          </span>
        </div>
      </div>

      {/* Right: circular category image */}
      {category.image && (
        <div
          onMouseEnter={() => setImgHov(true)}
          onMouseLeave={() => setImgHov(false)}
          style={{
            width:        110,
            height:       110,
            borderRadius: "50%",
            overflow:     "hidden",
            flexShrink:   0,
            transition:   "all 0.18s ease",
            transform:    imgHov ? "scale(1.05)" : "scale(1)",
            filter:       imgHov ? "brightness(1.1)" : "brightness(0.9)",
          }}
        >
          <img
            src={category.image}
            alt={category.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      )}

      {/* Fallback monogram if no image */}
      {!category.image && (
        <div style={{
          width:          110,
          height:         110,
          borderRadius:   "50%",
          background:     "#0d0d10",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          flexShrink:     0,
          gap:            4,
        }}>
          <span style={{
            fontFamily:   "system-ui, sans-serif",
            fontSize:     36,
            fontWeight:   800,
            color:        T.gold,
            lineHeight:   1,
            letterSpacing:"-0.03em",
          }}>
            {category.name?.charAt(0)}
          </span>
          <span style={{ ...s.label, fontSize: 7, color: T.dim, letterSpacing: "0.14em" }}>
            Genre
          </span>
        </div>
      )}
    </div>
  );
};

/* ─── Results Bar ────────────────────────────────────────────────────────── */
const ResultsBar = ({ count, catName }) => (
  <div style={{
    display:       "flex",
    justifyContent:"space-between",
    alignItems:    "center",
    padding:       "12px 0",
    borderBottom:  `1px solid ${T.border}`,
    marginBottom:  20,
  }}>
    <span style={{ ...s.label, fontSize: 9, color: T.dim }}>
      Showing <span style={{ color: T.gold }}>{count}</span> {count === 1 ? "book" : "books"} in {catName}
    </span>
    <span style={{ ...s.label, fontSize: 8, color: T.dim }}>
      Books in Collection
    </span>
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────────────── */
const CategoryDetails = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [books, setBooks]       = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchCategoryAndBooks = async () => {
      try {
        setLoading(true);
        const catsRes    = await axiosInstance.get("/categories");
        const matchedCat = catsRes.data.find((c) => c.slug === slug);
        if (matchedCat) {
          setCategory(matchedCat);
          const booksRes = await axiosInstance.get("/books", { params: { category: matchedCat._id } });
          setBooks(booksRes.data || []);
        }
      } catch (error) {
        console.error("Failed to load category details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryAndBooks();
  }, [slug]);

  if (loading) return <PageLoader label="Loading Category Details" />;

  if (!category) return (
    <div style={{ textAlign: "center", padding: "48px 0", fontFamily: "system-ui, sans-serif" }}>
      <p style={{ color: T.muted, fontSize: 13, marginBottom: 12 }}>Category not found.</p>
      <Link to="/categories" style={{ color: T.gold, fontSize: 11, fontWeight: 700 }}>
        Back to Categories
      </Link>
    </div>
  );

  return (
    <div style={{ background: T.bg, fontFamily: "system-ui, sans-serif", paddingBottom: 48 }}>

      {/* Hero */}
      <CategoryHero category={category} bookCount={books.length} />

      {/* Books section */}
      <div style={{ marginTop: 28 }}>
        {books.length === 0 ? (
          <EmptyState catName={category.name} />
        ) : (
          <>
            <ResultsBar count={books.length} catName={category.name} />

            <div
              className="cd-grid"
              style={{
                display:             "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap:                 16,
              }}
            >
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) { .cd-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 640px)  { .cd-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; } }
      `}</style>
    </div>
  );
};

export default CategoryDetails;