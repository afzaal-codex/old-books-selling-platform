import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import BookCard from "../../components/books/BookCard";
import { ArrowLeft, BookOpen } from "lucide-react";
import PageLoader from "../../components/loaders/PageLoader";

/* ─────────────────────────────────────────────────────────
   STYLES — sharp editorial, zero border-radius, system-ui
───────────────────────────────────────────────────────── */
const STYLES = `
  :root {
    --color-bg:           #0a0a0b;
    --color-card-bg:      #111114;
    --color-card-hover:   #16161a;
    --color-border:       #222228;
    --color-primary:      #c8860a;
    --color-primary-dim:  rgba(200,134,10,0.10);
    --color-text:         #f0ede8;
    --color-muted:        #6b6870;
    --color-muted-2:      #44424a;
    --font-body:          system-ui, sans-serif;
    --transition:         all 0.18s ease;
  }

  /* ── Shared page-header system (cart-header) ── */
  .cart-header {
    padding-bottom: 28px;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 28px;
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
  .ad-root {
    font-family: var(--font-body);
    background: var(--color-bg);
    color: var(--color-text);
    padding-bottom: 48px;
  }

  /* ── Back button row (sits inside cart-header as eyebrow) ── */
  .ad-back-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background: #111114;
    border: 1px solid var(--color-border);
    border-radius: 0;
    color: var(--color-muted);
    cursor: pointer;
    text-decoration: none;
    transition: var(--transition);
    flex-shrink: 0;
  }
  .ad-back-btn:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: var(--color-primary-dim);
  }

  /* ── Author profile card ── */
  .ad-profile {
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: 0;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.5);
    margin-bottom: 32px;
  }
  @media (min-width: 640px) {
    .ad-profile {
      flex-direction: row;
      align-items: flex-start;
      gap: 28px;
    }
  }

  /* ── Portrait ── */
  .ad-portrait {
    flex-shrink: 0;
    width: 120px;
    aspect-ratio: 3 / 4;
    border: 1px solid var(--color-border);
    overflow: hidden;
    background: #0d0d10;
    border-radius: 0;
  }
  @media (min-width: 640px) { .ad-portrait { width: 140px; } }

  .ad-portrait img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top center;
    display: block;
    transition: transform 0.22s ease;
  }
  .ad-profile:hover .ad-portrait img { transform: scale(1.03); }

  .ad-portrait__fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-primary-dim);
  }
  .ad-portrait__initial {
    font-size: 48px;
    font-weight: 800;
    color: var(--color-primary);
    letter-spacing: -0.02em;
    line-height: 1;
    font-family: var(--font-body);
  }

  /* ── Author details ── */
  .ad-details {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .ad-details__name {
    font-size: clamp(20px, 3vw, 26px);
    font-weight: 800;
    color: var(--color-text);
    letter-spacing: -0.01em;
    line-height: 1.15;
    margin: 0;
    font-family: var(--font-body);
  }
  .ad-details__bio {
    font-size: 13px;
    color: var(--color-muted);
    line-height: 1.7;
    margin: 0;
    max-width: 56ch;
  }

  /* ── Books section heading ── */
  .ad-books-heading {
    font-size: 18px;
    font-weight: 800;
    color: var(--color-text);
    letter-spacing: -0.01em;
    margin: 0 0 16px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--color-border);
    font-family: var(--font-body);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .ad-books-heading span {
    color: var(--color-primary);
  }

  /* ── Books grid ── */
  .ad-books-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  @media (min-width: 640px)  { .ad-books-grid { grid-template-columns: repeat(2, 1fr); gap: 18px; } }
  @media (min-width: 1024px) { .ad-books-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; } }

  /* ── Empty state ── */
  .ad-empty {
    border: 1px dashed var(--color-border);
    padding: 40px 24px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: var(--color-card-bg);
    border-radius: 0;
  }
  .ad-empty__title {
    font-size: 14px;
    font-weight: 700;
    color: var(--color-text);
    margin: 0;
    font-family: var(--font-body);
  }
  .ad-empty__desc {
    font-size: 12px;
    color: var(--color-muted);
    margin: 0;
  }

  /* ── Loading ── */
  .ad-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 280px;
    gap: 14px;
  }
  .ad-spinner {
    width: 30px;
    height: 30px;
    border: 2px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 0;
    animation: ad-spin 0.7s linear infinite;
  }
  @keyframes ad-spin { to { transform: rotate(360deg); } }
  .ad-loader__label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--color-muted);
    font-family: var(--font-body);
  }

  /* ── Not found ── */
  .ad-not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 280px;
    gap: 12px;
    text-align: center;
  }
  .ad-not-found__title {
    font-size: 15px;
    font-weight: 700;
    color: var(--color-text);
    margin: 0;
    font-family: var(--font-body);
  }
  .ad-not-found__link {
    font-size: 12px;
    color: var(--color-primary);
    text-decoration: none;
    border-bottom: 1px solid var(--color-primary-dim);
    transition: var(--transition);
  }
  .ad-not-found__link:hover { border-color: var(--color-primary); }
`;

const BackBtn = () => {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to="/authors"
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
        color:         hov ? "var(--color-primary)" : "#ffffff",
        background:    "#0d0d10",
        border:        `1px solid ${hov ? "var(--color-primary)" : "var(--color-border)"}`,
        borderRadius:  0,
        padding:       "6px 12px",
        textDecoration:"none",
        transition:    "all 0.18s ease",
        marginBottom:  "12px",
      }}
    >
      <ArrowLeft size={11} strokeWidth={2.5} />
      Back to Authors
    </Link>
  );
};

const AuthorDetails = () => {
  const { slug } = useParams();
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorAndBooks = async () => {
      try {
        setLoading(true);
        const authsRes = await axiosInstance.get("/authors");
        const matchedAuth = authsRes.data.find((a) => a.slug === slug);

        if (matchedAuth) {
          setAuthor(matchedAuth);
          const booksRes = await axiosInstance.get("/books", {
            params: { author: matchedAuth._id },
          });
          setBooks(booksRes.data || []);
        }
      } catch (error) {
        console.error("Failed to load author details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthorAndBooks();
  }, [slug]);

  /* inject styles once */
  useEffect(() => {
    if (document.getElementById("author-details-styles")) return;
    const tag = document.createElement("style");
    tag.id = "author-details-styles";
    tag.textContent = STYLES;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  /* ── Loading ── */
  if (loading) {
    return <PageLoader label="Loading Author Details" />;
  }

  /* ── Not found ── */
  if (!author) {
    return (
      <div className="ad-root">
        <div className="ad-not-found">
          <p className="ad-not-found__title">Author not found</p>
          <Link to="/authors" className="ad-not-found__link">← Back to Authors</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ad-root">
      <BackBtn />

      {/* ── Page Header — cart-header system ── */}
      <div className="cart-header">
        <div className="cart-header__eyebrow">
          Writers &amp; Storytellers
        </div>
        <h1 className="cart-header__title">{author.name}</h1>
        <p className="cart-header__sub">Browse all books written by this author</p>
      </div>

      {/* ── Author Profile ── */}
      <div className="ad-profile">

        {/* Portrait */}
        <div className="ad-portrait">
          {author.image ? (
            <img src={author.image} alt={author.name} />
          ) : (
            <div className="ad-portrait__fallback">
              <span className="ad-portrait__initial">
                {author.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="ad-details">
          <h2 className="ad-details__name">{author.name}</h2>
          <p className="ad-details__bio">
            {author.bio || "No biography details available for this author."}
          </p>
        </div>

      </div>

      {/* ── Books Section ── */}
      <h3 className="ad-books-heading">
        <BookOpen size={16} style={{ color: "var(--color-primary)" }} />
        Books by <span>{author.name}</span>
      </h3>

      {books.length === 0 ? (
        <div className="ad-empty">
          <p className="ad-empty__title">No Books Listed</p>
          <p className="ad-empty__desc">No books have been listed for this author yet.</p>
        </div>
      ) : (
        <div className="ad-books-grid">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}

    </div>
  );
};

export default AuthorDetails;