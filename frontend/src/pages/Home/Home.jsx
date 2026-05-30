import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchSettings } from "../../store/slices/cmsSlice";
import { fetchCategories } from "../../store/slices/categorySlice";
import { fetchAuthors } from "../../store/slices/authorSlice";
import BookCard from "../../components/books/BookCard";
import PageLoader from "../../components/loaders/PageLoader";
import Hero from "../../components/hero/Herosection";
import ConnectForm from "../../components/connect/ConnectForm";
import axiosInstance from "../../utils/axiosInstance";
import { ArrowRight, BookOpen, Clock, X } from "lucide-react";
import NewRelease from "../../components/HomePageFeatureBooks/NewRelease";
import OfferThisWeek from "../../components/HomePageFeatureBooks/OfferThisWeek";
import PromoSection from "../../components/HomePageFeatureBooks/PromoCode";
import { Helmet } from "react-helmet-async";

/* ─────────────────────────────────────────────────────────
   SHARED SECTION HEADING STYLES & LAYOUT
───────────────────────────────────────────────────────── */
const HOME_STYLES = `
  .hs-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 32px;
  }
  .hs-head__left { display: flex; flex-direction: column; gap: 4px; }
  .hs-head__title {
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: clamp(22px, 3vw, 28px);
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin: 0;
  }
  .hs-head__sub {
    font-size: 13px;
    color: #8c8994;
    margin: 0;
    font-family: system-ui, sans-serif;
  }

  .hs-view-all {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: system-ui, sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .10em;
    text-transform: uppercase;
    color: #c8860a;
    text-decoration: none;
    border: 1px solid rgba(200,134,10,0.2);
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.25s ease;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .hs-view-all:hover {
    background: rgba(200,134,10,0.08);
    border-color: #c8860a;
    transform: translateY(-1px);
  }

  .hs-section {
    margin-top: 48px;
    margin-bottom: 48px;
  }

  /* ── Category grid — always centered ── */
  .hs-cat-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
  }
  /* Each category card: fixed width so they wrap naturally and stay centered */
  .hs-cat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    padding: 24px 16px;
    background: #111115;
    border: 1px solid #222228;
    border-radius: 16px;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    gap: 12px;
    /* 6-per-row on large screens, flexes down naturally */
    width: calc((100% - 5 * 16px) / 6);
    min-width: 100px;
    box-sizing: border-box;
  }
  @media (max-width: 1099px) {
    .hs-cat-item { width: calc((100% - 3 * 16px) / 4); }
  }
  @media (max-width: 767px) {
    .hs-cat-item { width: calc((100% - 2 * 16px) / 3); }
  }
  @media (max-width: 479px) {
    .hs-cat-item { width: calc((100% - 1 * 16px) / 2); }
  }

  .hs-cat-item:hover {
    background: rgba(200,134,10,0.04);
    border-color: #c8860a;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  }

  .hs-cat-item__img {
    width: 60px; height: 60px;
    object-fit: cover;
    border: 2px solid #222228;
    border-radius: 50%;
    display: block;
    transition: all 0.25s ease;
  }
  .hs-cat-item:hover .hs-cat-item__img {
    border-color: #c8860a;
    transform: scale(1.05);
  }

  .hs-cat-item__icon {
    width: 60px; height: 60px;
    display: flex; align-items: center; justify-content: center;
    color: #c8860a; background: #16161c;
    border: 2px solid #222228;
    border-radius: 50%;
    transition: all 0.25s ease;
  }
  .hs-cat-item:hover .hs-cat-item__icon {
    border-color: #c8860a;
    color: #ffffff;
    background: #c8860a;
  }

  .hs-cat-item__name {
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 13.5px; font-weight: 600;
    color: #f0ede8; text-align: center;
    line-height: 1.3; margin: 0;
    transition: color 0.15s;
  }
  .hs-cat-item:hover .hs-cat-item__name { color: #c8860a; }

  /* ── Authors grid ──
     Desktop: 6 per row (flex-wrap, centered).
     Mobile (<480px): 3 per row, max 2 rows shown (6 cards).
  ── */
  .hs-authors-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    padding: 16px 0;
  }

  /* Each author card: fixed width for 6-per-row on desktop */
  .hs-author-item {
    display: flex;
    flex-direction: column;  /* image on top, text below */
    align-items: stretch;
    text-decoration: none;
    background: transparent;
    border: none;
    width: calc((100% - 5 * 16px) / 6);
    min-width: 100px;
    box-sizing: border-box;
    box-shadow: 0 12px 32px rgba(0,0,0,0.55);
    transition: box-shadow 0.3s ease;
    /* Remove alternating flip — always image-top */
  }
  .hs-author-item:hover {
    box-shadow: 0 16px 44px rgba(200,134,10,0.18);
  }

  /* Author image: square aspect, always on top */
  .hs-author-item__img-wrap {
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    flex-shrink: 0;
    background: #0a0a0c;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Author name+bio: always below image */
  .hs-author-item__name-wrap {
    width: 100%;
    padding: 14px 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: #0d0d10;
    box-sizing: border-box;
    flex-shrink: 0;
  }

  .hs-author-item__bio {
    font-size: 10px;
    line-height: 1.5;
    color: #8c8994;
    margin-top: 6px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
  }

  .hs-author-item__img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.25s ease;
  }
  .hs-author-item:hover .hs-author-item__img { transform: scale(1.05); }

  .hs-author-item__fallback {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    background: #16161c;
  }
  .hs-author-item__initial {
    font-size: 28px;
    font-weight: 800; color: #c8860a;
  }
  .hs-author-item__name {
    font-family: 'Outfit', system-ui, sans-serif;
    font-size: 13.5px; font-weight: 600;
    color: #f0ede8; text-align: center;
    line-height: 1.3; margin: 0;
    transition: color 0.15s;
  }
  .hs-author-item:hover .hs-author-item__name { color: #c8860a; }

  /* View More button for authors — hidden on desktop, shown on mobile */
  .hs-authors-view-more {
    display: none;
  }

  /* ── Mobile overrides (<480px) ── */
  @media (max-width: 479px) {
    /* Authors: 3 per row on mobile */
    .hs-author-item {
      width: calc((100% - 2 * 16px) / 3) !important;
    }
    /* Show View More button on mobile */
    .hs-authors-view-more {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-top: 24px;
    }
    /* Categories: 2 per row on mobile */
    .hs-cat-item {
      width: calc((100% - 1 * 16px) / 2) !important;
    }
  }
`;

/* ── Live Countdown Timer Component ── */
const CountdownTimer = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!expiresAt) return;

    const updateTimer = () => {
      const difference = new Date(expiresAt) - new Date();
      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const daysStr = days > 0 ? `${days}d ` : "";
      const hoursStr = String(hours).padStart(2, "0");
      const minutesStr = String(minutes).padStart(2, "0");
      const secondsStr = String(seconds).padStart(2, "0");

      setTimeLeft(`${daysStr}${hoursStr}:${minutesStr}:${secondsStr}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!timeLeft || timeLeft === "Expired") return null;

  return (
    <div className="absolute top-[38px] left-[15px] bg-[#0a0a0b]/90 border border-[#c8860a]/50 text-[#c8860a] px-2.5 py-1 rounded-lg text-[9px] font-extrabold tracking-wider uppercase flex items-center gap-1.5 shadow-lg backdrop-blur-md z-30" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <Clock size={10} className="animate-spin text-[#c8860a] [animation-duration:6s]" />
      <span>Ends in: {timeLeft}</span>
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.cms);
  const { categories } = useSelector((state) => state.categories);
  const { authors } = useSelector((state) => state.authors);

  const [newReleases, setNewReleases] = useState([]);
  const [offersThisWeek, setOffersThisWeek] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [highDiscounts, setHighDiscounts] = useState([]);
  const [showPromo, setShowPromo] = useState(false);
  const [loadingSections, setLoadingSections] = useState(true);

  const authorsSectionRef = useRef(null);

  // Mobile & Authors expanded states
  const [authorsExpanded, setAuthorsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 480);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Spotlight campaign popup after 2 seconds delay
  useEffect(() => {
    if (settings?.promotionalDiscount?.isActive) {
      const timer = setTimeout(() => {
        setShowPromo(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [settings]);

  /* Inject styling */
  useEffect(() => {
    if (document.getElementById("home-styles")) return;
    const tag = document.createElement("style");
    tag.id = "home-styles";
    tag.textContent = HOME_STYLES;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoadingSections(true);
        const [
          newReleasesRes,
          offersThisWeekRes,
          featuredRes,
          bestsellersRes,
          highDiscountsRes
        ] = await Promise.all([
          axiosInstance.get("/books?sort=latest"),
          axiosInstance.get("/books/high-discounts"),
          axiosInstance.get("/books/featured"),
          axiosInstance.get("/books/bestsellers"),
          axiosInstance.get("/books/high-discounts"),
        ]);
        setNewReleases((newReleasesRes.data || []).slice(0, 10));
        setOffersThisWeek((offersThisWeekRes.data.books || offersThisWeekRes.data || []).slice(0, 10));
        setFeaturedBooks((featuredRes.data.books || featuredRes.data || []).slice(0, 4));
        setBestSellers((bestsellersRes.data.books || bestsellersRes.data || []).slice(0, 4));
        setHighDiscounts((highDiscountsRes.data.books || highDiscountsRes.data || []).slice(0, 4));
      } catch (err) {
        console.error("Failed to load homepage sections:", err);
      } finally {
        setLoadingSections(false);
      }
    };
    fetchHomeData();
    dispatch(fetchSettings());
    dispatch(fetchCategories());
    dispatch(fetchAuthors());
  }, [dispatch]);

  // Filter or slice categories and authors
  const trendingCategories = categories.filter((c) => c.featured).slice(0, 6);
  const finalCategories = trendingCategories.length > 0 ? trendingCategories : categories.slice(0, 6);

  const trendingAuthors = authors.filter((a) => a.featured).slice(0, 12);
  const finalAuthors = trendingAuthors.length > 0 ? trendingAuthors : authors.slice(0, 12);

  // Desktop: always show all (up to 12, i.e. max 2 rows of 6).
  // Mobile: show 6 initially (2 rows of 3), expand to show all.
  const MOBILE_INITIAL_AUTHORS = 6; // 2 rows × 3 per row
  const showMobileViewMore = isMobile && finalAuthors.length > MOBILE_INITIAL_AUTHORS;
  const visibleAuthors = isMobile
    ? (authorsExpanded ? finalAuthors : finalAuthors.slice(0, MOBILE_INITIAL_AUTHORS))
    : finalAuthors;

  if (loadingSections) return <PageLoader label="Loading BookWorld" />;

  const cmsSeo = settings?.seo || {};
  const metaTitle = cmsSeo.title || "BookWorld | Online Rare & Used Books Store";
  const metaDesc = cmsSeo.description || "Explore a premium collection of rare, vintage, and second-hand books at BookWorld. Secure payment, fast shipping across Pakistan.";
  const metaKeywords = cmsSeo.keywords || "old books, used books, bookstore, novel, cheap books, second hand books Pakistan";

  return (
    <div style={{ background: "var(--color-bg, #0a0a0b)", color: "#f0ede8", paddingBottom: 64 }}>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="keywords" content={metaKeywords} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:site_name" content="BookWorld" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
      </Helmet>

      {/* HERO SECTION */}
      {settings?.homepageSections?.hero !== false && (
        <div className="w-full">
          <Hero />
        </div>
      )}

      <div className="container-custom">

        {/* NEW RELEASE BOOKS SECTION */}
        {settings?.homepageSections?.newReleases !== false && newReleases.length > 0 && (
          <NewRelease books={newReleases} />
        )}

        {/* PROMO BANNER SECTION */}
        {settings?.promoSection?.isActive !== false && (
          <PromoSection />
        )}

        {/* OFFERS THIS WEEK SECTION */}
        {settings?.homepageSections?.offersThisWeek !== false && offersThisWeek.length > 0 && (
          <OfferThisWeek offers={offersThisWeek} />
        )}

        {/* FEATURED BOOKS SECTION */}
        {settings?.homepageSections?.featuredBooks !== false && featuredBooks.length > 0 && (
          <section className="hs-section">
            <div className="hs-head">
              <div className="hs-head__left">
                <h2 className="hs-head__title">Featured Books</h2>
                <p className="hs-head__sub">Handpicked titles highly recommended by our editors</p>
              </div>
              <Link to="/books?featured=true" className="hs-view-all">
                See More <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featuredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* BEST SELLERS SECTION */}
        {settings?.homepageSections?.bestSeller !== false && bestSellers.length > 0 && (
          <section className="hs-section">
            <div className="hs-head">
              <div className="hs-head__left">
                <h2 className="hs-head__title">Best Sellers</h2>
                <p className="hs-head__sub">Most popular books flying off the shelves</p>
              </div>
              <Link to="/books?bestseller=true" className="hs-view-all">
                See More <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {bestSellers.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* HIGH DISCOUNTS SECTION */}
        {settings?.homepageSections?.highDiscount !== false && highDiscounts.length > 0 && (
          <section className="hs-section">
            <div className="hs-head">
              <div className="hs-head__left">
                <h2 className="hs-head__title">High Discounts</h2>
                <p className="hs-head__sub">Great savings on our top-rated collections</p>
              </div>
              <Link to="/offers" className="hs-view-all">
                See More <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {highDiscounts.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* ── TRENDING CATEGORIES ──
            flex-wrap + justify-content:center → always centered,
            1 item or 6 items behave the same way. */}
        {settings?.homepageSections?.trendingCategories !== false && finalCategories.length > 0 && (
          <section className="hs-section">
            <div className="hs-head">
              <div className="hs-head__left">
                <h2 className="hs-head__title">Trending Categories</h2>
                <p className="hs-head__sub">Explore most popular genres capturing minds</p>
              </div>
              <Link to="/categories" className="hs-view-all">
                All Categories <ArrowRight size={12} />
              </Link>
            </div>
            {/* flex-wrap centered — items center themselves no matter the count */}
            <div className="hs-cat-grid">
              {finalCategories.map((cat) => (
                <Link key={cat._id} to={`/category/${cat.slug}`} className="hs-cat-item">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="hs-cat-item__img" />
                  ) : (
                    <div className="hs-cat-item__icon"><BookOpen size={24} /></div>
                  )}
                  <span className="hs-cat-item__name">{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── TRENDING AUTHORS ──
            Desktop: 6 per row, image on top, name+bio below, centered.
            Mobile:  3 per row, max 2 rows (6 cards) shown, View More for rest. */}
        {settings?.homepageSections?.trendingAuthors !== false && finalAuthors.length > 0 && (
          <section className="hs-section" ref={authorsSectionRef}>
            <div className="hs-head">
              <div className="hs-head__left">
                <h2 className="hs-head__title">Trending Authors</h2>
                <p className="hs-head__sub">Brilliant creators and authors behind our collections</p>
              </div>
              <Link to="/authors" className="hs-view-all">
                All Authors <ArrowRight size={12} />
              </Link>
            </div>

            {/* Authors grid: flex-wrap, centered, image always on top */}
            <div className="hs-authors-grid">
              {visibleAuthors.map((author) => (
                <Link
                  key={author._id}
                  to={`/author/${author.slug}`}
                  className="hs-author-item"
                >
                  {/* IMAGE — always on top */}
                  <div className="hs-author-item__img-wrap">
                    {author.image ? (
                      <img src={author.image} alt={author.name} className="hs-author-item__img" />
                    ) : (
                      <div className="hs-author-item__fallback">
                        <span className="hs-author-item__initial">
                          {author.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* NAME + BIO — always below image */}
                  <div className="hs-author-item__name-wrap">
                    <p className="hs-author-item__name">{author.name}</p>
                    <p className="hs-author-item__bio">
                      {author.bio || "Discover the compelling stories, literary philosophy, and timeless works from this legendary creator."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* View More / Less — only rendered when mobile has >6 authors */}
            {showMobileViewMore && (
              <div className="hs-authors-view-more">
                <button
                  onClick={() => {
                    if (authorsExpanded) {
                      setAuthorsExpanded(false);
                      setTimeout(() => {
                        authorsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 50);
                    } else {
                      setAuthorsExpanded(true);
                    }
                  }}
                  style={{
                    background: "transparent",
                    border: "1px solid #c8860a",
                    color: "#c8860a",
                    padding: "8px 24px",
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "'Outfit', system-ui, sans-serif",
                  }}
                >
                  {authorsExpanded ? "View Less" : "View More"}
                </button>
              </div>
            )}
          </section>
        )}

        {/* CONNECT SECTION */}
        <ConnectForm />

      </div>

      {/* SPOTLIGHT MODAL */}
      <PromoSpotlightModal showPromo={showPromo} setShowPromo={setShowPromo} settings={settings} />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   PROMO SPOTLIGHT MODAL COMPONENT
───────────────────────────────────────────────────────── */
function PromoSpotlightModal({ showPromo, setShowPromo, settings }) {
  const promo = settings?.promotionalDiscount;
  const overlayRef = useRef(null);

  const title = promo?.title || "Spotlight Exclusive Book Deal";
  const slogan = promo?.slogan || "Unlock premium collections with special promotional savings.";
  const promoImageSrc = promo?.image || "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&q=80";

  const handleBackdrop = (e) => {
    if (e.target === overlayRef.current) setShowPromo(false);
  };

  useEffect(() => {
    if (showPromo) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [showPromo]);

  if (!showPromo || !promo) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');

        @keyframes pm-backdropIn {
          from { opacity: 0; backdrop-filter: blur(0px); }
          to   { opacity: 1; backdrop-filter: blur(18px); }
        }
        @keyframes pm-panelIn {
          from { opacity: 0; transform: translateY(36px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes pm-labelIn {
          from { opacity: 0; letter-spacing: 0.6em; }
          to   { opacity: 1; letter-spacing: 0.3em; }
        }
        @keyframes pm-titleIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pm-imgIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes pm-discountIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes pm-btnIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pm-shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes pm-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes pm-lineGrow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes pm-rulePulse {
          0%,100% { opacity: 0.35; }
          50%      { opacity: 0.7; }
        }

        .pm-close-btn {
          background: transparent !important;
          border: none !important;
          outline: none !important;
          cursor: pointer;
          color: rgba(255,255,255,0.6);
          transition: color 0.2s, transform 0.2s;
          padding: 8px;
          line-height: 0;
        }
        .pm-close-btn:hover { color: #ffffff; transform: rotate(90deg); }

        .pm-cta-btn {
          background: transparent !important;
          border: 1.5px solid rgba(200,146,42,0.75) !important;
          outline: none !important;
          color: #C8922A;
          font-family: 'Cinzel', serif;
          font-size: clamp(9px, 1.1vw, 12px);
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          text-decoration: none;
          padding: clamp(11px,1.4vw,15px) clamp(28px,3.5vw,48px);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: color 0.25s, border-color 0.25s, transform 0.25s, box-shadow 0.25s;
          position: relative;
          overflow: hidden;
          animation: pm-btnIn 0.6s 0.7s cubic-bezier(0.16,1,0.3,1) both;
        }
        .pm-cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(200,146,42,0.08);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .pm-cta-btn:hover { color: #E8B84B; border-color: #E8B84B !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(200,146,42,0.25); }
        .pm-cta-btn:hover::before { opacity: 1; }
        .pm-cta-btn .pm-arrow { transition: transform 0.24s ease; }
        .pm-cta-btn:hover .pm-arrow { transform: translateX(5px); }

        .pm-img-wrap { animation: pm-float 4.5s 1s ease-in-out infinite; }

        @media (max-width: 480px) {
          .pm-discount-num { font-size: clamp(72px, 22vw, 100px) !important; }
          .pm-title { font-size: clamp(22px, 7vw, 34px) !important; }
        }
      `}</style>

      <div
        ref={overlayRef}
        onClick={handleBackdrop}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(6,4,2,0.82)",
          backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
          animation: "pm-backdropIn 0.4s ease both",
          padding: "clamp(16px, 4vw, 40px)", boxSizing: "border-box",
        }}
      >
        <div style={{ position: "relative", width: "100%", maxWidth: "clamp(300px, 90vw, 560px)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <button
            className="pm-close-btn"
            onClick={() => setShowPromo(false)}
            aria-label="Close"
            style={{ position: "absolute", top: "-48px", right: "0px", zIndex: 10 }}
          >
            <X size={28} strokeWidth={2} />
          </button>

          <div
            style={{
              position: "relative", display: "flex", flexDirection: "column",
              alignItems: "center", textAlign: "center", width: "100%",
              maxHeight: "70vh", overflowY: "auto", overflowX: "hidden",
              scrollbarWidth: "none", background: "transparent", border: "none", outline: "none",
              animation: "pm-panelIn 0.55s 0.08s cubic-bezier(0.16,1,0.3,1) both", gap: 0,
            }}
          >
            <div style={{
              fontFamily: "'Cinzel', serif", fontSize: "clamp(8px, 1vw, 10px)", fontWeight: 600,
              letterSpacing: "0.3em", color: "#E8B84B", textTransform: "uppercase",
              opacity: 0.95, marginBottom: "6px",
              animation: "pm-labelIn 0.55s 0.18s cubic-bezier(0.16,1,0.3,1) both",
            }}>
              ✦ &nbsp;Enjoy this Exclusive Spotlight&nbsp; ✦
            </div>

            <div style={{
              width: "clamp(60px, 12vw, 100px)", height: "1px",
              background: "linear-gradient(90deg, transparent, #C8922A, transparent)",
              marginBottom: "8px",
              animation: "pm-lineGrow 0.6s 0.28s cubic-bezier(0.16,1,0.3,1) both, pm-rulePulse 3s 1s ease-in-out infinite",
              transformOrigin: "center",
            }} />

            <h2 className="pm-title" style={{
              fontFamily: "'Cinzel', serif", fontWeight: 900,
              fontSize: "clamp(20px, 4.5vw, 34px)", lineHeight: 1.08,
              letterSpacing: "-0.01em", color: "#ffffff", margin: 0, marginBottom: "4px",
              textShadow: "0 4px 24px rgba(0,0,0,0.85)",
              animation: "pm-titleIn 0.58s 0.26s cubic-bezier(0.16,1,0.3,1) both",
            }}>
              {title}
            </h2>

            {slogan && (
              <p style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic",
                fontWeight: 500, fontSize: "clamp(12px, 1.5vw, 15px)", color: "#ffffff",
                letterSpacing: "0.04em", margin: 0, marginBottom: "10px",
                textShadow: "0 2px 12px rgba(0,0,0,0.8)", opacity: 0.92,
                animation: "pm-titleIn 0.58s 0.34s cubic-bezier(0.16,1,0.3,1) both",
              }}>
                {slogan}
              </p>
            )}

            <div className="pm-img-wrap" style={{ marginBottom: "10px", animation: "pm-imgIn 0.7s 0.38s cubic-bezier(0.16,1,0.3,1) both", lineHeight: 0 }}>
              <img
                src={promoImageSrc} alt={title}
                style={{
                  maxHeight: "clamp(100px, 16vh, 180px)", maxWidth: "100%",
                  objectFit: "contain", display: "block", margin: "0 auto",
                  background: "transparent", border: "none", outline: "none",
                  filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.65))",
                  transition: "transform 0.4s ease",
                }}
              />
            </div>

            {promo.discountValue > 0 && (
              <div style={{ animation: "pm-discountIn 0.55s 0.5s cubic-bezier(0.34,1.56,0.64,1) both", marginBottom: "6px", lineHeight: 1 }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(7px, 0.8vw, 9px)", fontWeight: 600, letterSpacing: "0.28em", color: "#ffffff", marginBottom: "2px", textTransform: "uppercase" }}>Flat Discount</div>
                <div className="pm-discount-num" style={{
                  fontFamily: "'Cinzel', serif", fontWeight: 900,
                  fontSize: "clamp(52px, 12vw, 88px)", lineHeight: 0.9, letterSpacing: "-0.05em",
                  background: "linear-gradient(90deg, #C8922A, #E8B84B, #fff6d0, #E8B84B, #C8922A)",
                  backgroundSize: "200% auto", WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent", backgroundClip: "text",
                  animation: "pm-shimmer 3s linear infinite",
                }}>
                  {promo.discountValue}
                  <span style={{ fontSize: "0.46em", verticalAlign: "super", lineHeight: 0 }}>%</span>
                </div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(10px, 1.2vw, 13px)", fontWeight: 700, letterSpacing: "0.45em", color: "#ffffff", marginTop: "2px", opacity: 0.9, textTransform: "uppercase" }}>OFF</div>
              </div>
            )}

            <div style={{ width: "clamp(40px, 8vw, 70px)", height: "1px", background: "linear-gradient(90deg, transparent, rgba(200,146,42,0.5), transparent)", margin: "8px auto" }} />

            <Link to={promo.buttonLink || "/offers"} onClick={() => setShowPromo(false)} className="pm-cta-btn">
              {promo.buttonText || "Avail This Offer"}
              <span className="pm-arrow">
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                  <path d="M1 5H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  <path d="M9 1.5L13.5 5L9 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </span>
            </Link>

            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: "italic",
              fontSize: "clamp(9px, 1vw, 11px)", color: "#ffffff", letterSpacing: "0.12em",
              marginTop: "8px", marginBottom: "4px", opacity: 0.85,
            }}>
              Limited time · While stocks last
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
