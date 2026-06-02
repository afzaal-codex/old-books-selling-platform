import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
import { useRequestBook } from "../../context/RequestBookContext";
import { useSendGift } from "../../context/SendGiftContext";
import { useSelector, useDispatch } from "react-redux";
import { fetchSettings } from "../../store/slices/cmsSlice";

const SecondaryNav = ({ categories, authors, featuredBooks, bestSellerBooks, loading, settings }) => {
  const { openRequestModal } = useRequestBook();
  const { openGiftModal }    = useSendGift();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [hovered, setHovered] = useState(null);
  const navRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleMouseEnter = (key) => {
    clearTimeout(timeoutRef.current);
    setActiveMenu(key);
    setHovered(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setHovered(null);
    }, 120);
  };

  const handleMegaEnter = () => {
    clearTimeout(timeoutRef.current);
  };

  const secNav = settings?.secondaryNav || {};
  
  const staticLinks = [
    { label: "All Books",      path: "/books",                  mega: null,         show: true },
    { label: "Featured Books", path: "/books?featured=true",    mega: null,         show: secNav.featuredBooks !== false },
    { label: "Best Sellers",   path: "/books?bestseller=true",  mega: null,         show: secNav.bestSeller !== false },
    { label: "High Discounts", path: "/books?highDiscount=true", mega: null,         show: secNav.highDiscount !== false },
    { label: "Categories",     path: "/categories",             mega: "categories", show: true },
    { label: "Authors",        path: "/authors",                mega: "authors",    show: true },
  ].filter(link => link.show);

  const getMegaContent = (key) => {
    if (key === "featured")    return featuredBooks;
    if (key === "bestsellers") return bestSellerBooks;
    if (key === "categories")  return categories;
    if (key === "authors")     return authors;
    return [];
  };

  const getMegaPath = (key, item) => {
    if (key === "categories") return `/category/${item.slug}`;
    if (key === "authors")    return `/author/${item.slug}`;
    return `/book/${item._id}`;
  };

  const activeLink = staticLinks.find((l) => l.mega === activeMenu);

  return (
    <div
      ref={navRef}
      className="hidden md:block w-full relative"
      style={{
        background: "#ffffff",
        borderBottom: "1px solid rgba(200,134,10,0.5)",
        boxShadow: "0 1px 16px 0 rgba(200,134,10,0.10)",
      }}
    >
      <div className="container-custom">
        <div className="flex items-center h-10">

          {/* ── Nav links ── */}
          {staticLinks.map((link) => {
            const isActive = activeMenu === link.mega && link.mega !== null;
            return (
              <button
                key={link.path + link.label}
                onMouseEnter={() =>
                  link.mega
                    ? handleMouseEnter(link.mega)
                    : (clearTimeout(timeoutRef.current), setActiveMenu(null), setHovered(null))
                }
                onMouseLeave={link.mega ? handleMouseLeave : undefined}
                onClick={() => { setActiveMenu(null); navigate(link.path); }}
                className="group relative flex items-center h-full cursor-pointer whitespace-nowrap select-none transition-all duration-150"
                style={{
                  padding: "0 16px",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  color: isActive ? "#c8860a" : "#111111",
                  background: isActive ? "rgba(200,134,10,0.08)" : "transparent",
                }}
              >
                {/* hover bg overlay */}
                {!isActive && (
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    style={{ background: "rgba(200,134,10,0.08)" }}
                  />
                )}
                <span
                  className="relative z-10 group-hover:!text-[#c8860a] transition-colors duration-150"
                  style={{ color: isActive ? "#c8860a" : "#111111" }}
                >
                  {link.label}
                </span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0"
                    style={{ height: "2px", background: "#c8860a" }}
                  />
                )}
              </button>
            );
          })}

          {/* ── Separator — 2 golden lines ── */}
          <div className="mx-3 flex-shrink-0 flex items-center" style={{ gap: "3px", height: "18px" }}>
            <span style={{ width: "1px", height: "100%", background: "rgba(200,134,10,0.7)", display: "block" }} />
            <span style={{ width: "1px", height: "100%", background: "rgba(200,134,10,0.7)", display: "block" }} />
          </div>

          {/* ── Gift Card ── */}
          <button
            onMouseEnter={() => { clearTimeout(timeoutRef.current); setActiveMenu(null); setHovered(null); }}
            onClick={() => openGiftModal()}
            className="group relative flex items-center h-full cursor-pointer whitespace-nowrap transition-all duration-150"
            style={{ padding: "0 16px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em", color: "#c8860a" }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              style={{ background: "#c8860a" }}
            />
            <span className="relative z-10 group-hover:!text-black transition-colors duration-150">
              Gift Card
            </span>
          </button>

        </div>
      </div>

      {/* ── Mega Menu ── */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            key={activeMenu}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            onMouseEnter={handleMegaEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute left-0 right-0 z-50"
            style={{
              background: "#ffffff",
              borderTop: "1px solid rgba(200,134,10,0.18)",
              borderBottom: "1px solid rgba(200,134,10,0.35)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.12)",
            }}
          >
            <div className="container-custom" style={{ padding: "20px 0 24px 0" }}>
              {loading ? (
                <div style={{ display: "flex", gap: "6px", alignItems: "center", paddingLeft: "2px", paddingTop: "2px" }}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={{ height: "28px", width: "90px", background: "rgba(0,0,0,0.06)", borderRadius: "4px" }} />
                  ))}
                </div>
              ) : getMegaContent(activeMenu).length === 0 ? (
                <p style={{ fontSize: "13px", color: "rgba(0,0,0,0.3)", paddingLeft: "2px", paddingTop: "2px" }}>
                  No items found.
                </p>
              ) : (
                <div>
                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", paddingLeft: "2px", paddingTop: "2px" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c8860a" }}>
                      {activeLink?.label}
                    </span>
                    <div style={{ flex: 1, height: "1px", background: "rgba(200,134,10,0.2)" }} />
                    <Link
                      to={activeLink?.path ?? "/books"}
                      onClick={() => setActiveMenu(null)}
                      style={{ fontSize: "10px", color: "rgba(200,134,10,0.7)", letterSpacing: "0.06em", fontWeight: 800, textDecoration: "none" }}
                      className="hover:!text-[#c8860a] transition-colors"
                    >
                      View all →
                    </Link>
                  </div>

                  {/* Items — 5 columns fixed */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "2px" }}>
                    {getMegaContent(activeMenu).map((item, i) => (
                      <Link
                        key={item._id ?? i}
                        to={getMegaPath(activeMenu, item)}
                        onClick={() => setActiveMenu(null)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "11px 12px 9px 16px",
                          fontSize: "12.5px",
                          fontWeight: 500,
                          color: "#111111",
                          textDecoration: "none",
                          borderRadius: "4px",
                          transition: "background 0.12s, color 0.12s",
                        }}
                        className="group hover:!text-[#c8860a] hover:!bg-[rgba(200,134,10,0.08)]"
                      >
                        <span
                          className="flex-shrink-0 group-hover:!bg-[#c8860a]"
                          style={{
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background: "rgba(200,134,10,0.35)",
                            transition: "background 0.12s",
                          }}
                        />
                        <span className="truncate">{item.name ?? item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const dispatch = useDispatch();
  const [categories,      setCategories]      = useState([]);
  const [authors,         setAuthors]         = useState([]);
  const [featuredBooks,   setFeaturedBooks]   = useState([]);
  const [bestSellerBooks, setBestSellerBooks] = useState([]);
  const [loading,         setLoading]         = useState(false);
  const { settings } = useSelector((state) => state.cms);

  useEffect(() => {
    dispatch(fetchSettings());
    const fetchNavbarData = async () => {
      setLoading(true);
      try {
        const [categoriesRes, authorsRes, featuredRes, bestSellerRes] = await Promise.all([
          axiosInstance.get("/categories"),
          axiosInstance.get("/authors"),
          axiosInstance.get("/books/featured"),
          axiosInstance.get("/books/bestsellers"),
        ]);
        setCategories(categoriesRes.data ?? []);
        setAuthors(authorsRes.data ?? []);
        setFeaturedBooks(featuredRes.data.books ?? []);
        setBestSellerBooks(bestSellerRes.data.books ?? []);
      } catch (error) {
        console.error("Navbar fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNavbarData();
  }, []);

  const sharedData = { categories, authors, featuredBooks, bestSellerBooks, loading, settings };

  return <SecondaryNav {...sharedData} />;
};

export default Navbar;