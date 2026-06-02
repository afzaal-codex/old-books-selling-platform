import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import toast from "react-hot-toast";

const BOOKS = [
  {
    id: 1,
    title: "The Hidden Garden",
    category: "Literary Fiction",
    description: "A botanist discovers buried letters that rewrite her family's entire history beneath an ancient rose arbour.",
    price: "PKR 1,350",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&fit=crop",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop",
    overlay: "rgba(60,130,80,0.22)",
  },
  {
    id: 2,
    title: "Meridian",
    category: "Historical",
    description: "A 1922 cartographer maps uncharted Asia and stumbles into a conspiracy older than any empire on his charts.",
    price: "PKR 1,500",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&fit=crop",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop",
    overlay: "rgba(170,70,70,0.22)",
  },
  {
    id: 3,
    title: "The Last Apothecary",
    category: "Mystery",
    description: "A Victorian poison ledger leads a young widow to unsolved murders spanning thirty years of silence.",
    price: "PKR 1,440",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&fit=crop",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
    overlay: "rgba(170,135,40,0.22)",
  },
  {
    id: 4,
    title: "Paper Seas",
    category: "Coming of Age",
    description: "A girl raised on sailing charts discovers her father's ocean was never as calm as the lines he drew.",
    price: "PKR 1,170",
    image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=600&fit=crop",
    cover: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=450&fit=crop",
    overlay: "rgba(50,100,170,0.22)",
  },
  {
    id: 5,
    title: "Smoke & Mirrors",
    category: "Magical Realism",
    description: "Every mirror shows a different past. One woman has collected sixty years' worth and is finally ready to speak.",
    price: "PKR 1,560",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600&fit=crop",
    cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=450&fit=crop",
    overlay: "rgba(120,60,160,0.22)",
  },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=Noto+Sans:wght@400;700&display=swap');

  .bs-section {
    font-family: 'Lora', Georgia, serif;
    padding: 2.5rem 0 2rem;
    width: 100%;
  }

  .bs-header {
    text-align: center;
    margin-bottom: 1.8rem;
  }

  .bs-eyebrow {
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #888;
    margin: 0 0 5px;
  }

  .bs-main-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    line-height: 1.2;
  }

  .bs-main-title em {
    font-style: italic;
    font-weight: 400;
  }

  .bs-subtitle {
    font-size: 12.5px;
    font-style: italic;
    color: #888;
    margin: 5px 0 0;
  }

  .bs-carousel-row {
    display: flex;
    align-items: center;
    gap: 0;
    width: 100%;
  }

  /* When no arrows needed, center the track */
  .bs-carousel-row.bs-no-arrows {
    justify-content: center;
  }

  .bs-nav-btn {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1.5px solid rgba(190,155,80,0.6);
    background: rgba(212,175,90,0.18);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    z-index: 10;
    outline: none;
  }

  .bs-nav-btn:hover {
    background: rgba(212,175,90,0.42);
    border-color: rgba(190,155,80,1);
  }

  .bs-nav-btn svg {
    width: 18px;
    height: 18px;
    stroke: rgba(140,100,10,1);
    stroke-width: 2.5;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .bs-clip {
    flex: 1;
    overflow: hidden;
    margin: 0 10px;
  }

  /* No-arrows: clip still flex:1 for width measurement, but no overflow clipping needed */
  .bs-no-arrows .bs-clip {
    overflow: visible;
    margin: 0;
  }

  .bs-track {
    display: flex;
    gap: 14px;
    transition: transform 0.44s cubic-bezier(0.4,0,0.2,1);
    will-change: transform;
  }

  /* Center the track when no arrows */
  .bs-no-arrows .bs-track {
    justify-content: center;
    transform: none !important;
  }

  .bs-card {
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
    border-radius: 0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.16);
    display: flex;
    background: #0f3625;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .bs-card-body {
    position: relative;
    z-index: 2;
    display: flex;
    width: 100%;
    height: 100%;
  }

  .bs-img-wrap {
    flex-shrink: 0;
    margin: 3px 0 3px 3px;
    overflow: hidden;
    border-radius: 0;
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bs-img-wrap img {
    width: 80%;
    height: 80%;
    object-fit: contain;
    display: block;
    border: none;
    outline: none;
    border-radius: 0;
  }

  .bs-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 10px 11px 10px 10px;
    min-width: 0;
    gap: 4px;
  }

  .bs-category {
    font-size: 9px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 700;
    color: #c8860a;
    text-shadow: 0 1px 3px rgba(0,0,0,0.4);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bs-title {
    font-family: 'Playfair Display', serif;
    font-size: 13.5px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.22;
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .bs-author-line {
    font-size: 10px;
    margin: 0;
    color: #DCDCDC;
  }
  .bs-author-name {
    color: #c8860a;
    font-weight: 700;
  }

  .bs-desc {
    font-size: 10px;
    line-height: 1.5;
    color: #ffffff;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .bs-bottom {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: auto;
  }

  .bs-price-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-family: 'Noto Sans', Arial, sans-serif;
  }
  .bs-price-discounted {
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
  }
  .bs-price-original {
    font-size: 11px;
    color: red;
    text-decoration: line-through;
  }

  .bs-add-btn {
    width: 100%;
    padding: 6px 0;
    background: linear-gradient(135deg, #c8991a 0%, #e8b830 50%, #c8991a 100%);
    color: #0d0900;
    font-family: 'Lora', serif;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border: none;
    border-radius: 0;
    cursor: pointer;
    transition: filter 0.18s;
    box-shadow: 0 2px 8px rgba(160,120,0,0.3);
  }

  .bs-add-btn:hover {
    filter: brightness(1.1);
  }

  .bs-add-btn:active {
    filter: brightness(0.95);
    transform: scale(0.99);
  }

  @media (max-width: 480px) {
    .bs-main-title { font-size: 20px; }
  }

  /* ── Mobile 2-col grid (< 480px) ── */
  .bs-mobile-grid {
    display: none;
  }
  @media (max-width: 479px) {
    /* Hide the carousel on mobile */
    .bs-carousel-row { display: none; }
    /* Show the grid instead */
    .bs-mobile-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    /* Last card odd → span both columns and shrink to ~50% width, centered */
    .bs-mobile-grid .bs-mobile-card:last-child:nth-child(odd) {
      grid-column: 1 / -1;
      justify-self: center;
      width: calc(50% - 5px);
    }
    .bs-mobile-card {
      position: relative;
      overflow: hidden;
      border-radius: 0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.16);
      display: flex;
      flex-direction: column;
      background: #0f3625;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .bs-mobile-img-wrap {
      width: 100%;
      aspect-ratio: 3/4;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a2a1a;
    }
    .bs-mobile-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .bs-mobile-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 8px;
    }
    .bs-mobile-category {
      font-size: 8px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      font-weight: 700;
      color: #c8860a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bs-mobile-title {
      font-family: 'Playfair Display', serif;
      font-size: 12px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.2;
      margin: 0;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      height: 2.4em; /* Allocate exactly 2 lines of space */
    }
    .bs-mobile-author {
      font-size: 9px;
      color: #888;
      margin: 0;
      line-height: 1.2;
      height: 1.2em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .bs-mobile-author span { color: #c8860a; font-weight: 700; }
    .bs-mobile-desc {
      font-size: 9px;
      line-height: 1.45;
      color: #ccc;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      margin: 0;
      height: 4.35em; /* Allocate exactly 3 lines of space */
    }
    .bs-mobile-price {
      font-size: 12px;
      font-weight: 700;
      color: #fff;
    }
    .bs-mobile-price-orig {
      font-size: 10px;
      color: red;
      text-decoration: line-through;
      margin-left: 4px;
    }
    .bs-mobile-btn {
      width: 100%;
      padding: 6px 0;
      background: linear-gradient(135deg, #c8991a 0%, #e8b830 50%, #c8991a 100%);
      color: #0d0900;
      font-size: 8.5px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      margin-top: auto;
      transition: filter 0.18s;
    }
    .bs-mobile-btn:hover { filter: brightness(1.1); }
  }
`;

export default function BookLeaseSection({ books }) {
  const [idx, setIdx] = useState(0);
  const clipRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [cardHeight, setCardHeight] = useState(0);
  const [imgWidth, setImgWidth] = useState(0);
  const [visCount, setVisCount] = useState(3);
  const GAP = 14;

  const dispatch = useDispatch();

  const handleAddToCart = (rawBook) => {
    if (rawBook) {
      dispatch(addToCart({ book: rawBook, quantity: 1 }));
      toast.success(`"${rawBook.title}" added to cart!`);
    }
  };

  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef(null);

  const displayBooks = (books && books.length > 0) ? books.map(b => ({
    id: b._id,
    title: b.title,
    category: b.category?.name || "Uncategorized",
    description: b.description || "",
    originalPrice: b.originalPrice,
    discountedPrice: b.discountedPrice,
    hasDiscount: b.discountedPrice > 0 && b.discountedPrice < b.originalPrice,
    cover: b.images?.[0] || "https://placehold.co/300x450?text=Book",
    image: b.newReleaseBgImage || b.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&fit=crop",
    overlay: "rgba(16,185,129,0.3)",
    rawBook: b
  })) : BOOKS.map(b => ({
    ...b,
    originalPrice: 1500,
    discountedPrice: 1200,
    hasDiscount: true,
    overlay: "rgba(16,185,129,0.3)"
  }));

  // Whether to show arrows: only when more than 3 books on desktop
  const showArrows = displayBooks.length > 3;

  function calcLayout() {
    if (!clipRef.current) return;
    const w = clipRef.current.clientWidth;
    const v = 3;
    const cw = Math.floor((w - GAP * (v - 1)) / v);
    const ch = Math.floor(cw * 0.75);
    const iw = Math.floor(ch * (2 / 3));
    setVisCount(v);
    setCardWidth(cw);
    setCardHeight(ch);
    setImgWidth(iw);
  }

  useEffect(() => {
    calcLayout();
    const ro = new ResizeObserver(calcLayout);
    if (clipRef.current) ro.observe(clipRef.current);
    return () => ro.disconnect();
  }, []);

  const maxIdx = Math.max(0, displayBooks.length - visCount);

  function prev() {
    setIdx((i) => Math.max(0, i - 1));
  }

  function next() {
    setIdx((i) => Math.min(maxIdx, i + 1));
  }

  const handleToggle = () => {
    if (expanded) {
      setExpanded(false);
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } else {
      setExpanded(true);
    }
  };

  const translateX = showArrows ? idx * (cardWidth + GAP) : 0;

  // Mobile: show first 4 books initially (2 rows of 2), rest hidden until expanded
  const mobileVisibleBooks = expanded ? displayBooks : displayBooks.slice(0, 4);
  // Only show View More button on mobile if there are more than 4 books
  const showMobileViewMore = displayBooks.length > 4;

  return (
    <>
      <style>{styles}</style>
      <section className="bs-section" ref={sectionRef} aria-label="Book lease section">
        {/* Section Header */}
        <div style={{ marginBottom: "48px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{
              fontSize: "clamp(32px,4vw,52px)", fontWeight: 900,
              color: "#ffffff", margin: 0, lineHeight: 1,
              letterSpacing: "-0.03em",
              fontFamily: "'Playfair Display', Georgia, serif",
            }}>
              New Treasures
            </h1>
          </div>
        </div>

        {/* ── MOBILE GRID (< 480px): 2 cards per row, 2 rows then View More ── */}
        <div className="bs-mobile-grid">
          {mobileVisibleBooks.map((book) => (
            <div key={book.id} className="bs-mobile-card">
              <div className="bs-mobile-img-wrap">
                <img src={book.cover} alt={book.title} />
              </div>
              <div className="bs-mobile-info">
                <div className="bs-mobile-category">{book.category}</div>
                <h3 className="bs-mobile-title">{book.title}</h3>
                <p className="bs-mobile-author">
                  by <span>{book.rawBook?.author?.name || book.author || "—"}</span>
                </p>
                <p className="bs-mobile-desc">{book.description}</p>
                <div style={{ marginTop: "auto", paddingTop: 6 }}>
                  <span className="bs-mobile-price">
                    Rs. {book.hasDiscount ? book.discountedPrice : book.originalPrice}
                  </span>
                  {book.hasDiscount && (
                    <span className="bs-mobile-price-orig">Rs. {book.originalPrice}</span>
                  )}
                </div>
                <button className="bs-mobile-btn" onClick={() => handleAddToCart(book.rawBook)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View More / Less — only shown when more than 4 books */}
        {showMobileViewMore && (
          <div style={{ display: "none", justifyContent: "center", width: "100%", marginTop: "20px" }} className="bs-mobile-viewmore">
            <button
              onClick={handleToggle}
              style={{
                background: "transparent",
                border: "1px solid #c8860a",
                color: "#c8860a",
                padding: "8px 24px",
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {expanded ? "View Less" : "View More"}
            </button>
          </div>
        )}
        <style>{`
          @media (max-width: 479px) {
            div.bs-mobile-grid {
              display: grid !important;
            }
            div.bs-mobile-viewmore {
              display: flex !important;
            }
          }
        `}</style>

        {/* ── CAROUSEL (≥ 480px): 3 cards, arrows only when > 3 books, else centered ── */}
        <div className={`bs-carousel-row${showArrows ? "" : " bs-no-arrows"}`}>
          {/* Left arrow — only rendered when > 3 books */}
          {showArrows && (
            <button className="bs-nav-btn" onClick={prev} aria-label="Previous books">
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
          )}

          <div className="bs-clip" ref={clipRef}>
            <div className="bs-track" style={{ transform: `translateX(-${translateX}px)` }}>
              {displayBooks.map((book) => (
                <div key={book.id} className="bs-card" style={{ width: cardWidth, height: cardHeight }}>
                  <div className="bs-card-body">
                    {/* Left: 2:3 cover */}
                    <div className="bs-img-wrap" style={{ width: imgWidth, height: cardHeight - 6 }}>
                      <img src={book.cover} alt={book.title} />
                    </div>
                    {/* Right: info */}
                    <div className="bs-info">
                      <div className="bs-category">{book.category}</div>
                      <h3 className="bs-title">{book.title}</h3>
                      <p className="bs-author-line">
                        by <span className="bs-author-name">{book.rawBook?.author?.name || book.author}</span>
                      </p>
                      <p className="bs-desc">{book.description}</p>
                      <div className="bs-bottom">
                        <div className="bs-price-row">
                          {book.hasDiscount ? (
                            <>
                              <span className="bs-price-discounted">Rs. {book.discountedPrice}</span>
                              <span className="bs-price-original">Rs. {book.originalPrice}</span>
                            </>
                          ) : (
                            <span className="bs-price-discounted">Rs. {book.originalPrice}</span>
                          )}
                        </div>
                        <button className="bs-add-btn" onClick={() => handleAddToCart(book.rawBook)}>Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right arrow — only rendered when > 3 books */}
          {showArrows && (
            <button className="bs-nav-btn" onClick={next} aria-label="Next books">
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          )}
        </div>
      </section>
    </>
  );
}
