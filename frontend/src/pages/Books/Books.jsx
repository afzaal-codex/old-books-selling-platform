import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link } from "react-router-dom";
import { fetchBooks }      from "../../store/slices/bookSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import { fetchAuthors }    from "../../store/slices/authorSlice";
import BookSearchBar from "./Booksearchbar";
import PageLoader from "../../components/loaders/PageLoader";
import BookCard from "../../components/books/BookCard";
import {
  BookOpen, Star, X, ChevronDown,
  SlidersHorizontal, ArrowUpDown, BookX,
} from "lucide-react";
import { Helmet } from "react-helmet-async";

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const T = {
  bg:      "#0a0a0b",
  card:    "#111114",
  hover:   "#16161a",
  border:  "#222228",
  gold:    "#c8860a",
  text:    "#f0ede8",
  muted:   "#f0ede8",
  dim:     "#ffffff",
};
const font = "system-ui, sans-serif";

/* ─── Constants ───────────────────────────────────────────────────────────── */
const SORT_OPTIONS = [
  { value: "",             label: "Default"          },
  { value: "price_asc",   label: "Price: Low → High" },
  { value: "price_desc",  label: "Price: High → Low" },
  { value: "rating_desc", label: "Top Rated"          },
  { value: "newest",      label: "Newest First"       },
  { value: "title_asc",   label: "Title: A → Z"       },
];
const CONDITIONS = ["New", "Old", "Like New", "Good", "Fair"];
const DEFAULT_FILTERS = {
  search: "", searchBy: "title", category: "", author: "",
  condition: "", minPrice: "", maxPrice: "", rating: "",
  featured: "", bestseller: "", highDiscount: "",
  promo: "",
};

/* ─── Injected CSS ────────────────────────────────────────────────────────── */
const css = `
  /* ── Layout ── */
  .bk-page {
    min-height: 100vh;
    background: ${T.bg};
    color: ${T.text};
    font-family: ${font};
    padding: 24px 20px 48px;
    box-sizing: border-box;
  }
  .bk-layout {
    display: flex;
    gap: 28px;
    align-items: flex-start;
  }
  .bk-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* ── Sidebar ── */
  .bk-sidebar {
    width: 300px;
    flex-shrink: 0;
    position: sticky;
    top: 114px;
    max-height: calc(100vh - 130px);
    overflow-y: auto;
    background: ${T.card};
    border: 1px solid ${T.border};
    scrollbar-width: thin;
    scrollbar-color: ${T.border} transparent;
  }

  /* ── Grid ── */
  .bk-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }
  @media (max-width: 1200px) { .bk-grid { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 800px)  { .bk-grid { grid-template-columns: repeat(2,1fr); gap:10px; } }

  /* ── Book card ── */
  .bk-card {
    background: ${T.card};
    border: 1px solid ${T.border};
    display: flex;
    flex-direction: column;
    text-decoration: none;
    transition: all 0.18s ease;
    overflow: hidden;
  }
  .bk-card:hover { border-color:${T.gold}; background:${T.hover}; transform:translateY(-2px); }
  .bk-card:hover .bk-card-img  { transform:scale(1.04); }
  .bk-card:hover .bk-card-name { color:${T.gold}; }

  .bk-card-imgwrap {
    width:100%; aspect-ratio:2/3; overflow:hidden;
    background:#0d0d10; border-bottom:1px solid ${T.border}; position:relative;
  }
  .bk-card-img {
    width:100%; height:100%; object-fit:cover; display:block; transition:transform 0.18s ease;
  }
  .bk-card-badge {
    position:absolute; top:0; left:0;
    background:#cc2200; font-size:8px; font-weight:800;
    letter-spacing:0.08em; color:#fff; padding:3px 7px;
  }
  .bk-card-body { padding:10px 12px 12px; display:flex; flex-direction:column; gap:4px; flex:1; }
  .bk-card-cat  { font-size:8px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:${T.gold}; }
  .bk-card-name {
    font-size:12px; font-weight:800; color:${T.text}; line-height:1.3;
    letter-spacing:-0.01em; margin:0;
    display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
    transition:color 0.18s ease;
  }
  .bk-card-auth { font-size:10px; color:${T.muted}; }
  .bk-card-foot {
    display:flex; align-items:center; justify-content:space-between;
    margin-top:auto; padding-top:8px; border-top:1px solid ${T.border};
  }
  .bk-card-price { font-size:13px; font-weight:800; color:${T.gold}; }
  .bk-card-orig  { font-size:9px; color:${T.muted}; text-decoration:line-through; margin-left:4px; }
  .bk-card-rating{ display:flex; align-items:center; gap:3px; font-size:10px; font-weight:700; color:${T.text}; }

  /* ── Skeleton ── */
  @keyframes bk-shimmer {
    0%   { background-position:-400px 0; }
    100% { background-position: 400px 0; }
  }
  .bk-skel {
    background: linear-gradient(90deg, ${T.card} 25%, #1a1a1f 50%, ${T.card} 75%);
    background-size: 800px 100%;
    animation: bk-shimmer 1.4s infinite linear;
    border: 1px solid ${T.border};
  }

  /* ── Filter section ── */
  .bk-fsec-btn {
    width:100%; display:flex; align-items:center; justify-content:space-between;
    background:none; border:none; padding:11px 0; cursor:pointer;
    font-family:${font}; font-size:9px; font-weight:700;
    letter-spacing:0.12em; text-transform:uppercase; color:${T.muted};
    transition:color 0.18s ease;
  }
  .bk-fsec-btn:hover { color:${T.gold}; }

  /* ── Chips ── */
  .bk-chip {
    display:inline-flex; align-items:center; gap:5px;
    background:rgba(200,134,10,0.08); border:1px solid rgba(200,134,10,0.35);
    padding:3px 8px; font-size:10px; font-weight:600; color:${T.gold};
    letter-spacing:0.05em;
  }
  .bk-chip-rm {
    background:none; border:none; cursor:pointer; padding:0;
    color:${T.gold}; display:flex; align-items:center; opacity:0.7; transition:opacity 0.18s ease;
  }
  .bk-chip-rm:hover { opacity:1; }

  /* ── Buttons shared ── */
  .bk-btn-ghost {
    background:none; border:1px solid ${T.border}; border-radius:0;
    font-family:${font}; font-size:9px; font-weight:700;
    letter-spacing:0.10em; text-transform:uppercase; color:${T.muted};
    cursor:pointer; transition:all 0.18s ease; padding:8px 0;
  }
  .bk-btn-ghost:hover { border-color:${T.gold}; color:${T.gold}; }
  .bk-btn-gold {
    background:${T.gold}; border:1px solid ${T.gold}; border-radius:0;
    font-family:${font}; font-size:9px; font-weight:800;
    letter-spacing:0.10em; text-transform:uppercase; color:#000;
    cursor:pointer; transition:background 0.18s ease; padding:8px 0;
  }
  .bk-btn-gold:hover { background:#b07808; }

  /* ── Mobile drawer ── */
  .bk-drawer {
    position:fixed; inset:0; background:${T.bg}; z-index:1000;
    display:flex; flex-direction:column; overflow:hidden;
  }
  .bk-drawer-body {
    flex:1; overflow-y:auto; padding:0 16px 16px;
    scrollbar-width:thin; scrollbar-color:${T.border} transparent;
  }
  .bk-drawer-footer {
    padding:12px 16px; border-top:1px solid ${T.border}; background:${T.card}; flex-shrink:0;
  }

  /* ── Mobile show/hide ── */
  .bk-mobile-search   { display:none; }
  .bk-mobile-controls { display:none; align-items:center; gap:8px; flex-wrap:wrap; }
  .bk-desktop-sort    { display:flex; justify-content:flex-end; }

  @media (max-width: 900px) {
    .bk-layout          { flex-direction:column; }
    .bk-sidebar         { display:none !important; }
    .bk-mobile-search   { display:block; }
    .bk-mobile-controls { display:flex; }
    .bk-desktop-sort    { display:none; }
  }

  /* ── Loader spinner ── */
  @keyframes bk-spin { to { transform:rotate(360deg); } }
  .bk-spinner {
    width:28px; height:28px;
    border:2px solid ${T.border}; border-top-color:${T.gold};
    animation:bk-spin 0.7s linear infinite;
  }

  /* ── Input shared ── */
  .bk-input {
    width:100%; box-sizing:border-box;
    background:#0d0d10; border:1px solid ${T.border}; border-radius:0;
    padding:6px 9px; font-family:${font}; font-size:11px; color:${T.text}; outline:none;
    transition:border-color 0.18s ease;
  }
  .bk-input:focus { border-color:${T.gold}; }

  /* ── Checkbox / radio ── */
  .bk-check-label {
    display:flex; align-items:center; justify-content:space-between;
    padding:5px 0; cursor:pointer; font-family:${font};
  }
  .bk-check-label:hover span { color:${T.text}; }
`;

/* ═══════════════════════════════════════════════════════════════════════════
   SMALL INTERNAL COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

/* ── Skeleton card ── */
const SkeletonCard = () => (
  <div style={{ border: `1px solid ${T.border}`, overflow: "hidden" }}>
    <div className="bk-skel" style={{ width: "100%", aspectRatio: "2/3" }} />
    <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
      <div className="bk-skel" style={{ height: 8, width: "40%" }} />
      <div className="bk-skel" style={{ height: 12, width: "90%" }} />
      <div className="bk-skel" style={{ height: 10, width: "60%" }} />
      <div className="bk-skel" style={{ height: 13, width: "35%", marginTop: 6 }} />
    </div>
  </div>
);



/* ── Collapsible filter section ── */
const FilterSection = ({ title, defaultOpen = true, forceClose = false, children }) => {
  const [open, setOpen] = useState(forceClose ? false : defaultOpen);
  return (
    <div style={{ borderBottom: `1px solid ${T.border}` }}>
      <button className="bk-fsec-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
        {title}
        <ChevronDown size={12} strokeWidth={2} style={{ color: T.dim, transition: "transform 0.18s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>
      {open && <div style={{ paddingBottom: 12 }}>{children}</div>}
    </div>
  );
};

/* ── Checkbox item ── */
const CheckItem = ({ label, checked, onChange }) => (
  <label className="bk-check-label">
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ accentColor:T.gold, cursor:"pointer", width:12, height:12 }} />
      <span style={{ fontSize:11, color:T.muted, transition:"color 0.18s ease" }}>{label}</span>
    </div>
  </label>
);

/* ── Star rating picker ── */
const StarPicker = ({ value, onChange }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
    {[4,3,2,1].map((s) => (
      <label key={s} className="bk-check-label">
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <input type="radio" name="rating" value={s}
            checked={Number(value) === s}
            onChange={() => onChange(value === s ? "" : s)}
            style={{ accentColor:T.gold, cursor:"pointer" }}
          />
          <span style={{ fontSize:11, color:T.muted }}>
            {"★".repeat(s)}{"☆".repeat(5-s)}
            <span style={{ fontSize:9, marginLeft:4, color:T.dim }}>& up</span>
          </span>
        </div>
      </label>
    ))}
  </div>
);

/* ── Price range inputs ── */
const PriceRange = ({ minPrice, maxPrice, onChange }) => (
  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
    <input className="bk-input" type="number" placeholder="Min" value={minPrice} min={0}
      onChange={(e) => onChange("minPrice", e.target.value)} />
    <span style={{ color:T.dim, fontSize:10, flexShrink:0 }}>–</span>
    <input className="bk-input" type="number" placeholder="Max" value={maxPrice} min={0}
      onChange={(e) => onChange("maxPrice", e.target.value)} />
  </div>
);

/* ── Action buttons row ── */
const ActionBtns = ({ onReset, onApply }) => (
  <div style={{ display:"flex", gap:8 }}>
    <button className="bk-btn-ghost" style={{ flex:1 }} onClick={onReset}>Reset</button>
    <button className="bk-btn-gold"  style={{ flex:2 }} onClick={onApply}>Apply Filters</button>
  </div>
);

/* ── Filter body (shared by sidebar + drawer) ── */
const FilterBody = ({ filters, categories, authors, onFilterChange, allClosed = false }) => (
  <>
    <FilterSection title="Category" defaultOpen={!allClosed} forceClose={allClosed}>
      {categories.map((c) => (
        <CheckItem key={c._id} label={c.name}
          checked={filters.category === c.name}
          onChange={() => onFilterChange("category", filters.category === c.name ? "" : c.name)}
        />
      ))}
    </FilterSection>

    <FilterSection title="Author" defaultOpen={false} forceClose={allClosed}>
      <div style={{ maxHeight:180, overflowY:"auto", scrollbarWidth:"thin", scrollbarColor:`${T.border} transparent` }}>
        {authors.map((a) => (
          <CheckItem key={a._id} label={a.name}
            checked={filters.author === a.name}
            onChange={() => onFilterChange("author", filters.author === a.name ? "" : a.name)}
          />
        ))}
      </div>
    </FilterSection>

    <FilterSection title="Condition" defaultOpen={false} forceClose={allClosed}>
      {CONDITIONS.map((c) => (
        <CheckItem key={c} label={c}
          checked={filters.condition === c}
          onChange={() => onFilterChange("condition", filters.condition === c ? "" : c)}
        />
      ))}
    </FilterSection>

    <FilterSection title="Price Range" defaultOpen={false} forceClose={allClosed}>
      <PriceRange minPrice={filters.minPrice} maxPrice={filters.maxPrice} onChange={onFilterChange} />
    </FilterSection>

    <FilterSection title="Minimum Rating" defaultOpen={false} forceClose={allClosed}>
      <StarPicker value={filters.rating} onChange={(v) => onFilterChange("rating", v)} />
    </FilterSection>
  </>
);

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN BOOKS PAGE
═══════════════════════════════════════════════════════════════════════════ */
const Books = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { books, loading }   = useSelector((s) => s.books);
  const { categories = [] }  = useSelector((s) => s.categories);
  const { authors    = [] }  = useSelector((s) => s.authors);
  const { settings }         = useSelector((s) => s.cms);

  const [filters,      setFilters]      = useState({
    ...DEFAULT_FILTERS,
    search: searchParams.get("keyword") || searchParams.get("q") || "",
    searchBy: searchParams.get("searchBy") || "title",
    featured: searchParams.get("featured") || "",
    bestseller: searchParams.get("bestseller") || "",
    highDiscount: searchParams.get("highDiscount") || "",
    promo: searchParams.get("promo") || "",
  });
  const [sort,         setSort]         = useState("");
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [sortFocused,  setSortFocused]  = useState(false);

  const cmsSeo = settings?.seo || {};

  const dynamicSeo = useMemo(() => {
    let title = cmsSeo.title || "Search & Buy Books Online | Used & New Books | BookCorner";
    let description = cmsSeo.description || "Find the best deals on new, used, and second-hand books at BookCorner. Fast delivery and premium collection.";
    let keywords = cmsSeo.keywords || "old books, used books, bookstore, online books, novel, cheap books";

    if (filters.search) {
      title = `Buy "${filters.search}" Books Online | Cheap Used & New Books | BookCorner`;
      description = `Looking for "${filters.search}"? Find the cheapest prices, reader reviews, and high-quality used or new editions of "${filters.search}" books on BookCorner.`;
      keywords = `buy ${filters.search} books, cheap ${filters.search} online, ${filters.search} used books, purchase second hand ${filters.search}, BookCorner ${filters.search}`;
    } else if (filters.category) {
      title = `Buy ${filters.category} Books Online | Best Used & New Novels | BookCorner`;
      description = `Browse our extensive collection of ${filters.category} books. Get up to 80% off on second-hand, vintage, and new release ${filters.category} books at BookCorner.`;
      keywords = `buy ${filters.category} books, cheap ${filters.category} books, used ${filters.category} novels online, purchase second hand ${filters.category}, BookCorner ${filters.category}`;
    } else if (filters.author) {
      title = `Buy Books by ${filters.author} | Used & Rare Editions | BookCorner`;
      description = `Explore all books written by ${filters.author}. Discover rare editions, best sellers, and cheap second-hand paperbacks and hardcovers at BookCorner.`;
      keywords = `books by ${filters.author}, buy ${filters.author} books online, cheap ${filters.author} second hand, list of books by ${filters.author}, BookCorner ${filters.author}`;
    } else if (filters.bestseller) {
      title = `Best Selling Books Online | Top Rated Used & New Novels | BookCorner`;
      description = `Shop the ultimate list of best selling books on BookCorner. Handpicked popular novels, biographies, and academic textbooks at unbeatable prices.`;
      keywords = `bestsellers, best selling books online, top rated novels, most popular books, cheap bestsellers, buy popular books`;
    } else if (filters.featured) {
      title = `Featured Books & Curated Masterpieces | Recommended | BookCorner`;
      description = `Discover our specially curated list of featured books. Hand-selected premium quality books, top-rated literature, and must-read stories on BookCorner.`;
      keywords = `featured books, curated books, top books online, book recommendations, buy recommended books, BookCorner picks`;
    } else if (filters.highDiscount) {
      title = `High Discount Books & Special Book Offers | Cheap Reads | BookCorner`;
      description = `Incredible savings on your favorite books! Shop our high discount section for up to 90% off on used, new, and rare novels and textbooks.`;
      keywords = `book sale, high discount books, cheap books online, book deals, used books cheap, bookstore discount, BookCorner sale`;
    } else if (filters.promo) {
      title = `Special Promotional Offers & Coupon Deals | Book Corner`;
      description = `Shop exclusive time-limited book deals and rare collectible publications with 40% flat promo discounts at Book Corner.`;
      keywords = `promo discount, coupon code books, book deals, cheap novels, second hand books sale, Book Corner promo`;
    }

    return { title, description, keywords };
  }, [filters, cmsSeo]);

  /* Sync URL parameters back to state when they change */
  useEffect(() => {
    const queryKeyword = searchParams.get("keyword") || searchParams.get("q") || "";
    const querySearchBy = searchParams.get("searchBy") || "title";
    const queryFeatured = searchParams.get("featured") || "";
    const queryBestseller = searchParams.get("bestseller") || "";
    const queryHighDiscount = searchParams.get("highDiscount") || "";
    const queryPromo = searchParams.get("promo") || "";
    setFilters((prev) => {
      if (
        prev.search !== queryKeyword ||
        prev.searchBy !== querySearchBy ||
        prev.featured !== queryFeatured ||
        prev.bestseller !== queryBestseller ||
        prev.highDiscount !== queryHighDiscount ||
        prev.promo !== queryPromo
      ) {
        return {
          ...prev,
          search: queryKeyword,
          searchBy: querySearchBy,
          featured: queryFeatured,
          bestseller: queryBestseller,
          highDiscount: queryHighDiscount,
          promo: queryPromo,
        };
      }
      return prev;
    });
  }, [searchParams]);

  /* Fetch meta once */
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAuthors());
  }, [dispatch]);

  /* Fetch books on filter/sort change */
  useEffect(() => {
    const p = {};
    if (filters.search) {
      p.keyword = filters.search;
      if (filters.searchBy) p.searchBy = filters.searchBy;
    }
    if (filters.category)  p.category  = filters.category;
    if (filters.author)    p.author    = filters.author;
    if (filters.condition) p.condition = filters.condition;
    if (filters.minPrice)  p.minPrice  = filters.minPrice;
    if (filters.maxPrice)  p.maxPrice  = filters.maxPrice;
    if (filters.rating)    p.rating    = filters.rating;
    if (filters.featured)   p.featured   = filters.featured;
    if (filters.bestseller) p.bestseller = filters.bestseller;
    if (filters.highDiscount) p.highDiscount = filters.highDiscount;
    if (filters.promo) p.promo = filters.promo;
    if (sort)              p.sort      = sort;
    dispatch(fetchBooks(p));
    /* sync URL */
    const newParams = {};
    if (filters.search) {
      newParams.keyword = filters.search;
      if (filters.searchBy && filters.searchBy !== "title") {
        newParams.searchBy = filters.searchBy;
      }
    }
    if (filters.featured)   newParams.featured = filters.featured;
    if (filters.bestseller) newParams.bestseller = filters.bestseller;
    if (filters.highDiscount) newParams.highDiscount = filters.highDiscount;
    if (filters.promo) newParams.promo = filters.promo;
    setSearchParams(newParams, { replace: true });
  }, [filters, sort, dispatch]); // eslint-disable-line

  /* Lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const handleFilterChange = useCallback((key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSort("");
  }, []);

  const activeFilterCount = useMemo(() =>
    Object.entries(filters).filter(([k, v]) => v !== "" && k !== "search").length,
  [filters]);

  const hasFilters = useMemo(() =>
    Object.values(filters).some(Boolean) || sort !== "",
  [filters, sort]);

  /* Active chips array */
  const chips = useMemo(() => {
    const list = [];
    if (filters.search)    list.push({ key:"search",    label:"Search",    value:filters.search });
    if (filters.category)  list.push({ key:"category",  label:"Category",  value:filters.category });
    if (filters.author)    list.push({ key:"author",    label:"Author",    value:filters.author });
    if (filters.condition) list.push({ key:"condition", label:"Condition", value:filters.condition });
    if (filters.rating)    list.push({ key:"rating",    label:"Rating",    value:`${filters.rating}★+` });
    if (filters.minPrice || filters.maxPrice)
      list.push({ key:"price", label:"Price", value:`Rs.${filters.minPrice||"0"}–${filters.maxPrice||"∞"}` });
    if (filters.featured)   list.push({ key:"featured",   label:"Featured",   value:"Yes" });
    if (filters.bestseller) list.push({ key:"bestseller", label:"Bestseller", value:"Yes" });
    if (filters.highDiscount) list.push({ key:"highDiscount", label:"High Discount", value:"Yes" });
    if (filters.promo) list.push({ key:"promo", label:"Promo Discount", value:"Active" });
    return list;
  }, [filters]);

  const removeChip = (key) => {
    if (key === "price") setFilters((p) => ({ ...p, minPrice:"", maxPrice:"" }));
    else setFilters((p) => ({ ...p, [key]:"" }));
  };

  return (
    <div className="bk-page">
      <Helmet>
        <title>{dynamicSeo.title}</title>
        <meta name="description" content={dynamicSeo.description} />
        <meta name="keywords" content={dynamicSeo.keywords} />
      </Helmet>
      <style>{css}</style>



      <div className="bk-layout">

        {/* ── Desktop sidebar ── */}
        <aside className="bk-sidebar">
          {/* Sidebar header */}
          <div style={{ padding:"13px 16px 10px", borderBottom:`1px solid ${T.border}` }}>
            <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:T.muted }}>
              Filters
            </span>
          </div>

          <div style={{ padding:"0 16px 16px" }}>
            {/* Search in sidebar */}
            <div style={{ padding:"12px 0", borderBottom:`1px solid ${T.border}` }}>
              <BookSearchBar value={filters.search} onChange={(v) => handleFilterChange("search", v)} />
            </div>

            <FilterBody
              filters={filters}
              categories={categories}
              authors={authors}
              onFilterChange={handleFilterChange}
            />

            <div style={{ paddingTop:16 }}>
              <ActionBtns onReset={handleReset} onApply={() => {}} />
            </div>
          </div>
        </aside>

        {/* ── Content area ── */}
        <div className="bk-content">

          {/* Page header */}
          <div style={{ paddingBottom:20, borderBottom:`1px solid ${T.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase", color:T.gold, marginBottom:10 }}>
              <BookOpen size={11} />
              Our Collection
            </div>
            <h1 style={{ fontFamily:font, fontSize:"clamp(24px,4vw,34px)", fontWeight:800, color:T.text, lineHeight:1.15, letterSpacing:"-0.01em", margin:"0 0 6px" }}>
              Books
            </h1>
            <p style={{ fontFamily:font, fontSize:13, color:T.muted, margin:0 }}>
              {loading ? "Loading catalogue…" : `${books.length.toLocaleString()} title${books.length !== 1 ? "s" : ""} available`}
            </p>
          </div>

          {/* Mobile: sort + filter trigger */}
          <div className="bk-mobile-controls">
            {/* Filter trigger */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              style={{ display:"flex", alignItems:"center", gap:6, background:T.card, border:`1px solid ${T.border}`, borderRadius:0, padding:"7px 12px", fontFamily:font, fontSize:10, fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:T.text, cursor:"pointer", transition:"all 0.18s ease", position:"relative" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=T.gold; e.currentTarget.style.color=T.gold; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.text; }}
            >
              <SlidersHorizontal size={11} />
              Filters
              {activeFilterCount > 0 && (
                <span style={{ background:T.gold, color:"#000", fontSize:8, fontWeight:800, padding:"1px 5px", marginLeft:2 }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:T.muted, display:"flex", alignItems:"center", gap:4 }}>
                <ArrowUpDown size={10} /> Sort
              </span>
              <div style={{ position:"relative" }}>
                <select value={sort} onChange={(e) => setSort(e.target.value)}
                  onFocus={() => setSortFocused(true)} onBlur={() => setSortFocused(false)}
                  style={{ background:T.card, border:`1px solid ${sortFocused?T.gold:T.border}`, borderRadius:0, padding:"7px 26px 7px 10px", fontFamily:font, fontSize:11, fontWeight:600, color:T.text, outline:"none", cursor:"pointer", appearance:"none", transition:"border-color 0.18s ease", minWidth:130 }}
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value} style={{ background:T.card }}>{o.label}</option>)}
                </select>
                <span style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", color:T.muted, pointerEvents:"none", fontSize:9 }}>▾</span>
              </div>
            </div>
          </div>

          {/* Desktop: sort row */}
          <div className="bk-desktop-sort">
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:T.muted, display:"flex", alignItems:"center", gap:4 }}>
                <ArrowUpDown size={10} /> Sort
              </span>
              <div style={{ position:"relative" }}>
                <select value={sort} onChange={(e) => setSort(e.target.value)}
                  onFocus={() => setSortFocused(true)} onBlur={() => setSortFocused(false)}
                  style={{ background:T.card, border:`1px solid ${sortFocused?T.gold:T.border}`, borderRadius:0, padding:"7px 26px 7px 10px", fontFamily:font, fontSize:11, fontWeight:600, color:T.text, outline:"none", cursor:"pointer", appearance:"none", transition:"border-color 0.18s ease", minWidth:140 }}
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value} style={{ background:T.card }}>{o.label}</option>)}
                </select>
                <span style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", color:T.muted, pointerEvents:"none", fontSize:9 }}>▾</span>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {chips.length > 0 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
              {chips.map((chip) => (
                <span key={chip.key} className="bk-chip">
                  <span style={{ color:T.muted, fontSize:9, textTransform:"uppercase", letterSpacing:"0.08em" }}>{chip.label}:</span>
                  {chip.value}
                  <button className="bk-chip-rm" onClick={() => removeChip(chip.key)} aria-label={`Remove ${chip.label}`}>
                    <X size={10} strokeWidth={2.5} />
                  </button>
                </span>
              ))}
              {chips.length > 1 && (
                <button onClick={handleReset}
                  style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:0, padding:"3px 8px", fontFamily:font, fontSize:9, fontWeight:700, letterSpacing:"0.10em", textTransform:"uppercase", color:T.muted, cursor:"pointer", transition:"all 0.18s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor=T.gold; e.currentTarget.style.color=T.gold; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.muted; }}
                >
                  Clear All
                </button>
              )}
            </div>
          )}

          {/* Books grid */}
          {loading ? (
            <PageLoader label="Loading Books" />
          ) : books.length === 0 ? (
            <div style={{ border:`1px dashed ${T.border}`, padding:"56px 32px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
              <BookX size={28} color={T.dim} strokeWidth={1.5} />
              <div>
                <p style={{ fontSize:14, fontWeight:700, color:T.muted, margin:"0 0 4px" }}>No books found</p>
                <p style={{ fontSize:11, color:T.dim, margin:0 }}>
                  {hasFilters ? "Try adjusting your filters or search query." : "No books are currently available."}
                </p>
              </div>
              {hasFilters && (
                <button className="bk-btn-ghost" style={{ padding:"8px 20px" }} onClick={handleReset}>
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="bk-grid">
              {books.map((book) => <BookCard key={book._id} book={book} />)}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      {drawerOpen && (
        <>
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:999 }} onClick={() => setDrawerOpen(false)} />
          <div className="bk-drawer" role="dialog" aria-modal="true" aria-label="Filters">
            {/* Drawer header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 16px", borderBottom:`1px solid ${T.border}`, flexShrink:0 }}>
              <span style={{ fontFamily:font, fontSize:9, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:T.muted }}>Filters</span>
              <button onClick={() => setDrawerOpen(false)}
                style={{ background:"none", border:`1px solid ${T.border}`, borderRadius:0, padding:"5px 7px", cursor:"pointer", color:T.muted, display:"flex", alignItems:"center", transition:"all 0.18s ease" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=T.gold; e.currentTarget.style.color=T.gold; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.muted; }}
                aria-label="Close filters"
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>

            {/* Drawer body */}
            <div className="bk-drawer-body">
              <FilterBody
                filters={filters}
                categories={categories}
                authors={authors}
                onFilterChange={handleFilterChange}
                allClosed={true}
              />
            </div>

            {/* Sticky footer */}
            <div className="bk-drawer-footer">
              <ActionBtns onReset={handleReset} onApply={() => setDrawerOpen(false)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Books;