import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import toast from "react-hot-toast";

const OFFERS = [
  {
    id: 1,
    category: "Limited Edition",
    title: "The Shadow of the Wind",
    description:
      "A labyrinthine tale of obsession, love, and literary mystery set in post-war Barcelona. Carlos Ruiz Zafón weaves a gothic masterpiece that lingers long after the final page.",
    author: "Carlos Ruiz Zafón",
    price: "$18.99",
    oldPrice: "$34.00",
    endsAt: Date.now() + 2 * 24 * 3600 * 1000 + 14 * 3600 * 1000 + 23 * 60 * 1000 + 48 * 1000,
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80",
    circlePosition: "bottom-right",
  },
  {
    id: 2,
    category: "Collector's Pick",
    title: "Midnight in the Garden of Good and Evil",
    description:
      "A dazzling portrait of Savannah society, murder, and the gothic South. John Berendt's narrative reads like the finest Southern fiction — lush, languid, and deeply human.",
    author: "John Berendt",
    price: "$14.49",
    oldPrice: "$27.50",
    endsAt: Date.now() + 1 * 24 * 3600 * 1000 + 7 * 3600 * 1000 + 41 * 60 * 1000 + 12 * 1000,
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
    circlePosition: "bottom-right",
  },
  {
    id: 3,
    category: "Editorial Select",
    title: "The Name of the Rose",
    description:
      "Umberto Eco's erudite medieval mystery unfolds within a labyrinthine monastery library. Equal parts theological thriller and semiotic investigation into truth and knowledge.",
    author: "Umberto Eco",
    price: "$16.99",
    oldPrice: "$29.95",
    endsAt: Date.now() + 3 * 24 * 3600 * 1000 + 2 * 3600 * 1000 + 8 * 60 * 1000 + 33 * 1000,
    coverUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&q=80",
    circlePosition: "bottom-right",
  },
  {
    id: 4,
    category: "Curator's Choice",
    title: "Never Let Me Go",
    description:
      "Kazuo Ishiguro's devastating meditation on memory, mortality, and what it means to be human. A quiet, heartbreaking novel that reveals its darkness slowly and irrevocably.",
    author: "Kazuo Ishiguro",
    price: "$13.99",
    oldPrice: "$24.00",
    endsAt: Date.now() + 0 * 24 * 3600 * 1000 + 18 * 3600 * 1000 + 55 * 60 * 1000 + 7 * 1000,
    coverUrl: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&q=80",
    circlePosition: "bottom-right",
  },
];

function useCountdown(targetTs) {
  const [remaining, setRemaining] = useState(Math.max(0, targetTs - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setRemaining(Math.max(0, targetTs - Date.now())), 1000);
    return () => clearInterval(id);
  }, [targetTs]);
  const totalSecs = Math.floor(remaining / 1000);
  const d = Math.floor(totalSecs / 86400);
  const h = Math.floor((totalSecs % 86400) / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return { d, h, m, s };
}

function CountdownTimer({ endsAt }) {
  const { d, h, m, s } = useCountdown(endsAt);
  const pad = (n) => String(n).padStart(2, "0");
  const units = [
    { val: pad(d), label: "D" },
    { val: pad(h), label: "H" },
    { val: pad(m), label: "M" },
    { val: pad(s), label: "S" },
  ];
  return (
    <div className="otw-countdown-container" style={{ display: "flex", alignItems: "center", gap: "2px", fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <div className="otw-ends-in-label" style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", color: "#c8860a", textTransform: "uppercase", marginRight: "10px", fontFamily: "'Outfit', 'Inter', sans-serif" }}>
        Ends In
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
        {units.map(({ val, label }, i) => (
          <span key={label} style={{ display: "flex", alignItems: "center" }}>
            <span className="otw-timer-unit" style={{
              display: "inline-flex", flexDirection: "column", alignItems: "center",
              background: "rgba(200,134,10,0.08)", border: "1px solid rgba(200,134,10,0.25)",
              padding: "5px 8px", minWidth: "36px",
            }}>
              <span className="otw-timer-num" style={{ fontSize: "16px", fontWeight: 900, letterSpacing: "0.04em", color: "#ffffff", lineHeight: 1, fontVariantNumeric: "tabular-nums", fontFamily: "'Outfit', 'Inter', sans-serif" }}>{val}</span>
              <span className="otw-timer-label" style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.14em", color: "#c8860a", marginTop: "2px", fontFamily: "'Outfit', 'Inter', sans-serif" }}>{label}</span>
            </span>
            {i < units.length - 1 && (
              <span className="otw-timer-colon" style={{ fontSize: "14px", fontWeight: 900, color: "rgba(200,134,10,0.5)", margin: "0 2px", lineHeight: 1, fontFamily: "'Outfit', 'Inter', sans-serif" }}>:</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

function DecorativeCircles({ position }) {
  const isTopLeft = position === "top-left";
  const circleData = [
    { r: 120, color: "rgba(200,134,10,0.22)", width: 1.5 },
    { r: 90, color: "rgba(176,100,20,0.28)", width: 1 },
    { r: 62, color: "rgba(240,220,180,0.18)", width: 1 },
    { r: 38, color: "rgba(160,130,80,0.32)", width: 1.2 },
    { r: 20, color: "rgba(200,134,10,0.40)", width: 1 },
  ];
  const posStyle = isTopLeft
    ? { position: "absolute", top: 0, left: 0, overflow: "hidden", width: "260px", height: "260px", pointerEvents: "none", zIndex: 1 }
    : { position: "absolute", bottom: 0, right: 0, overflow: "hidden", width: "260px", height: "260px", pointerEvents: "none", zIndex: 1 };
  const cx = isTopLeft ? 0 : 260;
  const cy = isTopLeft ? 0 : 260;
  return (
    <div style={posStyle}>
      <svg width="260" height="260" style={{ display: "block" }}>
        {circleData.map(({ r, color, width }, i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={width} />
        ))}
      </svg>
    </div>
  );
}

function OfferCard({ offer, onAddToCart }) {
  const circlePos = "bottom-right";
  return (
    <div className="otw-card">
      <DecorativeCircles position={circlePos} />

      {/* TOP / LEFT: Book Image */}
      <div className="otw-img-wrap">
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(200,134,10,0.06) 0%, transparent 60%)",
          zIndex: 1,
        }} />
        <img
          src={offer.coverUrl}
          alt={offer.title}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            objectPosition: "center",
            display: "block",
            filter: "brightness(0.92) contrast(1.05)",
            position: "relative", zIndex: 2,
          }}
        />
        <div className="otw-img-mask" />
      </div>

      {/* RIGHT: Content */}
      <div className="otw-content">
        {/* Category */}
        <div className="otw-category">
          {offer.category}
        </div>

        {/* Title */}
        <h2 className="otw-title">
          {offer.title}
        </h2>

        {/* Author */}
        <div className="otw-author">
          By {offer.author}
        </div>

        {/* Description */}
        <p className="otw-desc">
          {offer.description}
        </p>

        {/* Countdown */}
        <div className="otw-countdown-row">
          <CountdownTimer endsAt={offer.endsAt} />
        </div>

        {/* Pricing + Button */}
        <div className="otw-pricing-row">
          <div className="otw-price-line" style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <span style={{
              fontSize: "24px", fontWeight: 900, color: "#c8860a", letterSpacing: "-0.02em",
              fontFamily: "'Outfit', 'Inter', sans-serif",
            }}>
              {offer.price}
            </span>
            <span style={{ fontSize: "12px", textDecoration: "line-through", color: "red", fontFamily: "'Outfit', 'Inter', sans-serif" }}>
              {offer.oldPrice}
            </span>
          </div>
          <button
            onClick={() => onAddToCart?.(offer.rawBook)}
            className="otw-cart-btn"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function NavButton({ direction, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="otw-nav-arrow"
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [direction === "prev" ? "left" : "right"]: "-42px",
        width: "34px", height: "54px", borderRadius: 0,
        backdropFilter: "none",
        background: "transparent",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 12, transition: "all 0.25s ease",
        opacity: disabled ? 0.35 : 1,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.transform = "translateY(-50%) scale(1.12)"; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.transform = "translateY(-50%) scale(1)"; }}
      aria-label={direction === "prev" ? "Previous offer" : "Next offer"}
    >
      <svg width="24" height="24" viewBox="0 0 18 18" fill="none" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.85))" }}>
        {direction === "prev"
          ? <polyline points="11,3 5,9 11,15" stroke="#c8860a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          : <polyline points="7,3 13,9 7,15" stroke="#c8860a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        }
      </svg>
    </button>
  );
}

function DotIndicators({ total, current, onDotClick }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "28px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          style={{
            width: i === current ? "24px" : "6px",
            height: "6px",
            borderRadius: "999px",
            background: i === current ? "#c8860a" : "rgba(255,255,255,0.2)",
            border: "none", cursor: "pointer", padding: 0,
            transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          }}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

const VISIBLE = 2;

export default function OffersThisWeek({ offers }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const touchStartX = useRef(null);

  const dispatch = useDispatch();

  const handleAddToCart = (rawBook) => {
    if (rawBook) {
      dispatch(addToCart({ book: rawBook, quantity: 1 }));
      toast.success(`"${rawBook.title}" added to cart!`);
    }
  };

  const visibleCount = isMobile ? 1 : VISIBLE;

  const displayOffers = (offers && offers.length > 0) ? offers.map(b => ({
    id: b._id,
    category: b.bestseller ? "Bestseller" : b.featured ? "Featured" : "Special Offer",
    title: b.title,
    description: b.description || "",
    author: b.author?.name || "Unknown Author",
    price: `Rs. ${b.discountedPrice > 0 ? b.discountedPrice : b.originalPrice}`,
    oldPrice: `Rs. ${b.originalPrice}`,
    endsAt: b.discountExpiresAt ? new Date(b.discountExpiresAt).getTime() : Date.now() + 2 * 24 * 3600 * 1000,
    coverUrl: b.images?.[0] || "https://placehold.co/400x600?text=Book",
    rawBook: b
  })) : OFFERS;

  const maxIndex = displayOffers.length - visibleCount;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const goTo = useCallback((idx) => {
    if (isAnimating) return;
    const clamped = Math.max(0, Math.min(idx, maxIndex));
    setIsAnimating(true);
    setCurrentIndex(clamped);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating, maxIndex]);

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(currentIndex + (diff > 0 ? 1 : -1));
    touchStartX.current = null;
  };

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

  const translatePct = -(currentIndex * (100 / visibleCount));

  // Desktop always shows slider carousel. Mobile shows simple vertical card list.
  // Mobile: show 2 cards initially. Click expand/View More to show all.
  const mobileVisibleOffers = expanded ? displayOffers : displayOffers.slice(0, 2);

  return (
    <section ref={sectionRef} style={{
      background: "#0c0c0f",
      padding: "72px 0",
      fontFamily: "'Playfair Display', Georgia, serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,800;0,900;1,400&display=swap');
        * { box-sizing: border-box; }

        /* Offer Card layout */
        .otw-card {
          position: relative;
          background: #111114;
          border: 1px solid rgba(255,255,255,0.10);
          overflow: hidden;
          display: flex;
          flex-direction: row;
          min-height: 340px;
          height: 100%;
          flex: 1 1 100%;
        }

        .otw-img-wrap {
          position: relative;
          width: 260px;
          min-width: 220px;
          flex-shrink: 0;
          margin: 8px 0 8px 8px;
          background: #0a0a0c;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          zIndex: 2;
        }

        .otw-img-mask {
          position: absolute; inset: 0; z-index: 3;
          background: linear-gradient(to right, transparent 70%, #111114 100%);
        }

        .otw-content {
          flex: 1;
          padding: 36px 36px 32px 32px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          zIndex: 2;
        }

        .otw-category {
          font-size: 10px; text-transform: uppercase; letter-spacing: 0.14em;
          fontWeight: 700; color: #c8860a; marginBottom: 14px;
          font-family: 'Playfair Display', Georgia, serif;
        }

        .otw-title {
          font-size: clamp(22px,2.2vw,30px); fontWeight: 800; lineHeight: 1.08;
          letter-spacing: -0.025em; color: #ffffff; margin: 0 0 14px 0;
          font-family: 'Playfair Display', Georgia, serif;
          text-shadow: 0 2px 24px rgba(0,0,0,0.6);
        }

        .otw-author {
          font-size: 12px; fontWeight: 700; color: "rgba(240,237,232,0.7)";
          letter-spacing: "0.06em"; text-transform: uppercase; marginBottom: 14px;
        }

        .otw-desc {
          font-size: 13.5px; line-height: 1.65; color: #9a9a9f;
          margin: 0 0 28px 0; maxWidth: "380px";
        }

        .otw-countdown-row {
          margin-bottom: 20px;
        }

        .otw-pricing-row {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-top: auto;
        }

        /* Desktop button: equal padding left/right and top/bottom */
        .otw-cart-btn {
          background: #c8860a; color: #000000; height: auto;
          padding: 14px 14px; fontSize: 10px; fontWeight: 800;
          letter-spacing: 0.09em; text-transform: uppercase; border: none;
          cursor: pointer; transition: background 0.2s ease;
          font-family: 'Playfair Display', Georgia, serif;
          white-space: nowrap;
          user-select: none;
        }
        .otw-cart-btn:hover { background: #dda020; }

        .otw-mobile-grid {
          display: none;
        }

        /* ── Mobile Phone Styles ── */
        @media (max-width: 479px) {
          .otw-slider-container {
            display: none !important;
          }
          .otw-mobile-grid {
            display: flex !important;
            flex-direction: column;
            gap: 16px;
            width: 100%;
          }
          .otw-card {
            flex-direction: column;
            width: 100%;
            min-height: auto;
            border: none;
            background: #111114;
          }
          /* Top Part: Image (left) & Name/Desc (right) equal height */
          .otw-img-wrap {
            width: 100px;
            height: 120px;
            min-width: 100px;
            margin: 12px;
            align-self: flex-start;
          }
          .otw-img-mask {
            display: none;
          }
          .otw-content {
            padding: 12px;
            display: flex;
            flex-direction: column;
            width: 100%;
          }
          /* We create three parts horizontally on mobile */
          .otw-card-top-row {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            width: 100%;
            height: 144px;
          }
          .otw-card-top-right {
            flex: 1;
            padding: 12px 12px 12px 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 144px;
          }
          .otw-title {
            font-size: 14px;
            margin-bottom: 4px;
            font-weight: 700;
          }
          .otw-author {
            font-size: 10px;
            margin-bottom: 4px;
          }
          .otw-desc {
            font-size: 11px;
            line-height: 1.4;
            color: #9a9a9f;
            margin-bottom: 0;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
          /* Middle section: cover full width and live counter */
          .otw-card-middle-row {
            width: 100%;
            padding: 8px 12px;
            border-top: 1px solid rgba(255,255,255,0.06);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            display: flex;
            justify-content: center;
          }
          .otw-countdown-container {
            width: 100% !important;
            justify-content: space-between !important;
            gap: 1px !important;
          }
          /* Reduce timer sizes so they never cut off on narrow screens */
          .otw-ends-in-label {
            font-size: 8px !important;
            margin-right: 4px !important;
          }
          .otw-timer-unit {
            padding: 3px 5px !important;
            min-width: 28px !important;
          }
          .otw-timer-num {
            font-size: 11px !important;
          }
          .otw-timer-label {
            font-size: 6.5px !important;
            margin-top: 1px !important;
          }
          .otw-timer-colon {
            font-size: 10px !important;
            margin: 0 1px !important;
          }

          /* Bottom section: prices stay in one row, button gets its own row on mobile */
          .otw-card-bottom-row {
            width: 100%;
            padding: 12px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            gap: 10px;
          }
          .otw-price-line {
            width: 100%;
            flex-wrap: nowrap;
            white-space: nowrap;
            justify-content: center;
          }
          /* Mobile button padding is equal from left/right and top/bottom */
          .otw-cart-btn {
            width: 100%;
            flex: none;
            margin-left: 0;
            height: auto;
            padding: 10px 12px !important;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>

        {/* Section Header */}
        <div style={{ marginBottom: "48px", display: "flex", alignItems: "flex-end", justifyContents: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{
              fontSize: "clamp(32px,4vw,52px)", fontWeight: 900,
              color: "#ffffff", margin: 0, lineHeight: 1,
              letterSpacing: "-0.03em",
              fontFamily: "'Playfair Display', Georgia, serif",
            }}>
              Offers This Week
            </h1>
          </div>
          <div style={{
            fontSize: "12px", color: "rgba(176,176,181,0.6)",
            letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700,
            borderBottom: "1px solid rgba(200,134,10,0.3)", paddingBottom: "4px",
          }}>
            {displayOffers.length} Limited Deals
          </div>
        </div>

        {/* ── MOBILE VERTICAL LIST (< 480px) ── */}
        <div className="otw-mobile-grid">
          {mobileVisibleOffers.map((offer) => (
            <div key={offer.id} className="otw-card">
              {/* Part 1: Top horizontal part with image left and title/desc right */}
              <div className="otw-card-top-row">
                <div className="otw-img-wrap">
                  <img src={offer.coverUrl} alt={offer.title} />
                </div>
                <div className="otw-card-top-right">
                  <div>
                    <div className="otw-category" style={{ marginBottom: "2px", fontSize: "8px" }}>{offer.category}</div>
                    <h2 className="otw-title">{offer.title}</h2>
                    <div className="otw-author">By {offer.author}</div>
                  </div>
                  <p className="otw-desc">{offer.description}</p>
                </div>
              </div>

              {/* Part 2: Middle row with full width live counter */}
              <div className="otw-card-middle-row">
                <CountdownTimer endsAt={offer.endsAt} />
              </div>

              {/* Part 3: prices in one row, add-to-cart in its own mobile row */}
              <div className="otw-card-bottom-row">
                <div className="otw-price-line" style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                  <span style={{ fontSize: "18px", fontWeight: 900, color: "#c8860a", fontFamily: "'Outfit', sans-serif" }}>
                    {offer.price}
                  </span>
                  <span style={{ fontSize: "11px", textDecoration: "line-through", color: "red", fontFamily: "'Outfit', sans-serif" }}>
                    {offer.oldPrice}
                  </span>
                </div>
                <button className="otw-cart-btn" onClick={() => handleAddToCart(offer.rawBook)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View More / Less button horizontally centered */}
        {displayOffers.length > 2 && (
          <div className="otw-mobile-grid" style={{ display: "none", justifyContent: "center", width: "100%", marginTop: "20px" }}>
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
            div.otw-mobile-grid {
              display: flex !important;
              flex-direction: column !important;
            }
            div.otw-mobile-grid[style*="display: none"] {
              display: flex !important;
              justify-content: center !important;
            }
          }
        `}</style>

        {/* ── SLIDER CAROUSEL (≥ 480px) ── */}
        <div className="otw-slider-container" style={{ position: "relative" }}>
          <div
            style={{
              overflow: "hidden",
              position: "relative",
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={trackRef}
              style={{
                display: "flex",
                gap: isMobile ? "0" : "20px",
                transition: isAnimating ? "transform 0.6s cubic-bezier(0.42,0,0.18,1)" : "none",
                transform: `translateX(calc(${translatePct}% - ${currentIndex * (isMobile ? 0 : 20 / visibleCount)}px))`,
                willChange: "transform",
              }}
            >
              {displayOffers.map((offer) => (
                <div
                  key={offer.id}
                  style={{
                    flex: `0 0 calc(${100 / visibleCount}% - ${isMobile ? 0 : 20 * (visibleCount - 1) / visibleCount}px)`,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <OfferCard offer={offer} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          </div>

          <NavButton direction="prev" onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0} />
          <NavButton direction="next" onClick={() => goTo(currentIndex + 1)} disabled={currentIndex >= maxIndex} />
          
          <DotIndicators total={maxIndex + 1} current={currentIndex} onDotClick={goTo} />
        </div>

        {/* Footer Rule */}
        <div style={{
          marginTop: "52px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div style={{ fontSize: "10px", color: "rgba(176,176,181,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
            All offers end at midnight · Prices in PKR · While stocks last
          </div>
          <div style={{ fontSize: "10px", color: "rgba(200,134,10,0.5)", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
            ◆ The Collector's Edition
          </div>
        </div>
      </div>
    </section>
  );
}
