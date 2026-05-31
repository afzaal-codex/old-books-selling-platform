import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthors } from "../../store/slices/authorSlice";
import { Link } from "react-router-dom";
import { PenLine, ChevronDown } from "lucide-react";
import PageLoader from "../../components/loaders/PageLoader";

/* ─────────────────────────────────────────────────────────
   STYLES — zero card borders, editorial PNG portrait grid,
   row dividers only, mobile collapsible
───────────────────────────────────────────────────────── */
const STYLES = `
  :root {
    --color-bg:          #0a0a0b;
    --color-card-bg:     #111114;
    --color-border:      #222228;
    --color-primary:     #c8860a;
    --color-text:        #f0ede8;
    --color-muted:       #DCDCDC;
    --font-body:         system-ui, sans-serif;
    --transition:        all 0.18s ease;
  }

  /* ── Shared page-header (cart-header system) ── */
  .cart-header {
    padding-bottom: 28px;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 32px;
  }
  .cart-header__eyebrow {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--color-primary);
    margin-bottom: 10px;
    font-family: var(--font-body);
  }
  .cart-header__title {
    font-family: var(--font-body);
    font-size: clamp(26px, 4vw, 36px);
    font-weight: 800;
    color: var(--color-text);
    line-height: 1.15;
    margin: 0 0 6px;
    letter-spacing: -0.01em;
  }
  .cart-header__sub {
    font-size: 13px;
    color: var(--color-muted);
    margin: 0;
    font-family: var(--font-body);
  }

  /* ── Root ── */
  .authors-root {
    font-family: var(--font-body);
    background: var(--color-bg);
    color: var(--color-text);
    padding-bottom: 56px;
  }

  /* ── Collapsible wrapper ── */
  .authors-collapse-wrap {
    overflow: hidden;
    transition: height 0.38s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* ── Desktop: editorial alternating list ── */
  .authors-list {
    display: flex;
    flex-direction: column;
    gap: 36px;
    padding: 20px 0;
    align-items: center;
  }

  /* ── Premium Alternating Cards (desktop) ── */
  .author-card {
    display: flex;
    background: #000000;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7);
    border: none;
    text-decoration: none;
    width: 520px;
    height: 260px;
    overflow: hidden;
    transition: var(--transition);
  }

  .author-card--reverse {
    flex-direction: row-reverse;
  }

  .author-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(200, 134, 10, 0.15);
  }

  .author-card__img-wrap {
    width: 260px;
    height: 260px;
    flex-shrink: 0;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    background: #0a0a0c;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .author-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    transition: transform 0.3s ease;
  }

  .author-card:hover .author-card__img {
    transform: scale(1.05);
  }

  .author-card__fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #111114;
  }

  .author-card__initial {
    font-size: 80px;
    font-weight: 800;
    color: var(--color-primary);
    opacity: 0.25;
    line-height: 1;
  }

  .author-card__text-wrap {
    width: 260px;
    height: 260px;
    flex-shrink: 0;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
  }

  .author-card__name {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 10px;
    transition: color 0.15s;
  }

  .author-card:hover .author-card__name {
    color: var(--color-primary);
  }

  .author-card__bio {
    font-size: 11.5px;
    line-height: 1.6;
    color: var(--color-muted);
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
  }

  /* ── Mobile grid layout (≤ 799px): 3 cols, 2 cols on very small ── */
  @media (max-width: 799px) {
    .authors-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      padding: 12px 0;
      align-items: start;
    }
    .author-card {
      flex-direction: column !important;
      width: 100% !important;
      height: auto !important;
      box-shadow: 0 4px 16px rgba(0,0,0,0.6);
    }
    .author-card--reverse {
      flex-direction: column !important;
    }
    .author-card__img-wrap {
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 1 / 1 !important;
    }
    .author-card__text-wrap {
      width: 100% !important;
      height: auto !important;
      padding: 10px 8px 12px;
    }
    .author-card__name {
      font-size: 11px;
      margin-bottom: 5px;
    }
    .author-card__bio {
      font-size: 9.5px;
      -webkit-line-clamp: 4;
    }
    .author-card__initial {
      font-size: 40px;
    }
  }
  @media (max-width: 480px) {
    .authors-list {
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
  }
  @media (max-width: 350px) {
    .authors-list {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* ── Mobile toggle button ── */
  .authors-toggle-wrap {
    display: flex;
    justify-content: center;
    padding-top: 24px;
    border-top: 1px solid var(--color-border);
    margin-top: 0;
  }
  @media (min-width: 800px) { .authors-toggle-wrap { display: none; } }

  .authors-toggle-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--color-primary);
    padding: 6px 0;
    border-radius: 0;
    transition: var(--transition);
  }
  .authors-toggle-btn:hover { opacity: 0.7; }
  .authors-toggle-btn svg { transition: transform 0.3s ease; flex-shrink: 0; }
  .authors-toggle-btn.expanded svg { transform: rotate(180deg); }

  /* ── Loading ── */
  .authors-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 240px;
    gap: 14px;
  }
  .authors-spinner {
    width: 28px;
    height: 28px;
    border: 2px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 0;
    animation: authors-spin 0.7s linear infinite;
  }
  @keyframes authors-spin { to { transform: rotate(360deg); } }
  .authors-loader__label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--color-muted);
  }

  /* ── Empty ── */
  .authors-empty {
    border: 1px dashed var(--color-border);
    padding: 40px 24px;
    text-align: center;
  }
  .authors-empty__title {
    font-size: 14px;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 6px;
  }
  .authors-empty__desc {
    font-size: 12px;
    color: var(--color-muted);
    margin: 0;
  }
`;

/* Mobile: show 3 rows × 2 cols = 6 items initially */
const MOBILE_COLS  = 2;
const MOBILE_ROWS  = 3;
const MOBILE_LIMIT = MOBILE_COLS * MOBILE_ROWS;

const Authors = () => {
  const dispatch = useDispatch();
  const { authors, loading } = useSelector((state) => state.authors);

  const [expanded, setExpanded]   = useState(false);
  const [isMobile, setIsMobile]   = useState(false);
  const [collapseH, setCollapseH] = useState(null);

  const gridRef    = useRef(null);
  const sectionRef = useRef(null);

  /* detect mobile breakpoint */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 799px)");
    const update = () => { setIsMobile(mq.matches); setCollapseH(null); };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* measure collapsed height = height of first MOBILE_LIMIT items */
  useEffect(() => {
    if (!isMobile || !gridRef.current || authors.length <= MOBILE_LIMIT) return;
    requestAnimationFrame(() => {
      const items = gridRef.current?.querySelectorAll(".author-item");
      if (!items || items.length < MOBILE_LIMIT) return;
      let h = 0;
      for (let i = 0; i < MOBILE_LIMIT; i++) {
        const bot = items[i].offsetTop + items[i].offsetHeight;
        if (bot > h) h = bot;
      }
      setCollapseH(h);
    });
  }, [authors, isMobile]);

  useEffect(() => { dispatch(fetchAuthors()); }, [dispatch]);

  /* inject styles once */
  useEffect(() => {
    if (document.getElementById("authors-styles-v2")) return;
    const tag = document.createElement("style");
    tag.id = "authors-styles-v2";
    tag.textContent = STYLES;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  const handleToggle = () => {
    if (expanded) {
      setExpanded(false);
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 40);
    } else {
      setExpanded(true);
    }
  };

  const showToggle = isMobile && authors.length > MOBILE_LIMIT;
  const wrapStyle  = showToggle && !expanded && collapseH !== null
    ? { height: collapseH + "px" }
    : { height: "auto" };

  if (loading) {
    return (
      <div className="authors-root">
        <PageLoader label="Loading Authors" />
      </div>
    );
  }

  return (
    <div className="authors-root" ref={sectionRef}>

      {/* ── Page Header — cart-header system ── */}
      <div className="cart-header">
        <div className="cart-header__eyebrow">
          <PenLine size={11} />
          Writers &amp; Storytellers
        </div>
        <h1 className="cart-header__title">Authors</h1>
        <p className="cart-header__sub">Discover stories from legendary writers</p>
      </div>

      {authors.length === 0 ? (
        <div className="authors-empty">
          <p className="authors-empty__title">No Authors Found</p>
          <p className="authors-empty__desc">Check back soon — more writers are being added.</p>
        </div>
      ) : (
        <>
          {/* ── Collapsible list of alternating premium cards ── */}
          <div className="authors-collapse-wrap" style={wrapStyle}>
            <div className="authors-list" ref={gridRef}>
              {authors.map((auth, index) => {
                const isEven = index % 2 === 1;
                return (
                  <Link
                    key={auth._id}
                    to={`/author/${auth.slug}`}
                    className={`author-card ${isEven ? "author-card--reverse" : ""}`}
                  >
                    <div className="author-card__img-wrap">
                      {auth.image ? (
                        <img
                          src={auth.image}
                          alt={auth.name}
                          className="author-card__img"
                        />
                      ) : (
                        <div className="author-card__fallback">
                          <span className="author-card__initial">
                            {auth.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="author-card__text-wrap">
                      <h3 className="author-card__name">{auth.name}</h3>
                      <p className="author-card__bio">
                        {auth.bio || "Discover the compelling stories, literary philosophy, and timeless works from this legendary creator."}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Mobile expand/collapse toggle ── */}
          {showToggle && (
            <div className="authors-toggle-wrap">
              <button
                className={`authors-toggle-btn${expanded ? " expanded" : ""}`}
                onClick={handleToggle}
              >
                {expanded ? "View Less" : "View More Authors"}
                <ChevronDown size={12} />
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default Authors;