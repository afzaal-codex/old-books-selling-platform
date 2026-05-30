import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { fetchWishlist } from "../../store/slices/wishlistSlice";
import { fetchMyOrders } from "../../store/slices/orderSlice";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { useRequestBook } from "../../context/RequestBookContext";
import { useSendGift } from "../../context/SendGiftContext";
import companyData from "../../data/companyData";

const Divider = () => <div className="h-px bg-white/10" style={{ marginTop: "2px", marginBottom: "2px" }} />;

const MobileSidebar = ({ isOpen, setIsOpen }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();
  const { openRequestModal } = useRequestBook();
  const { openGiftModal }    = useSendGift();
  const reduxUser = useSelector((state) => state.auth.user);
  const user      = reduxUser || JSON.parse(localStorage.getItem("user") || "null");

  const { wishlist } = useSelector((state) => state.wishlist);
  const wishlistCount = wishlist?.books?.length ?? 0;

  const { myOrders } = useSelector((state) => state.orders);
  const ordersCount = myOrders?.length ?? 0;

  const [accordion,  setAccordion]  = useState(null);
  const [categories, setCategories] = useState([]);
  const [authors,    setAuthors]    = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      try {
        const [catRes, authRes] = await Promise.all([
          axiosInstance.get("/categories"),
          axiosInstance.get("/authors"),
        ]);
        setCategories(catRes.data ?? []);
        setAuthors(authRes.data   ?? []);
      } catch (err) {
        console.error("MobileSidebar fetch error:", err);
      }
    };
    fetchData();

    if (user) {
      dispatch(fetchWishlist());
      dispatch(fetchMyOrders());
    }
  }, [isOpen, user, dispatch]);

  useEffect(() => {
    document.body.style.overflow            = isOpen ? "hidden" : "";
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow            = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => { if (!isOpen) setAccordion(null); }, [isOpen]);

  const go = (path) => { setIsOpen(false); setAccordion(null); navigate(path); };

  const PROTECTED_PATHS = ["/checkout", "/orders", "/wishlist", "/profile"];

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    toast.success("Logged out successfully");
    // Stay on same page if public; go home if on a protected route
    const isProtected = PROTECTED_PATHS.some((p) => location.pathname.startsWith(p));
    if (isProtected) navigate("/");
  };

  /* 15px * 1.20 = 18px main, 12.5px * 1.20 = 15px sub */
  const rowFs  = "18px";
  const subFs  = "15px";
  const rowPad = { paddingTop: "4px", paddingBottom: "4px", paddingLeft: "3px" };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed top-0 left-0 right-0 bottom-16 z-[55] bg-black/60 backdrop-blur-sm md:hidden"
          />

          <motion.div
            initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="fixed top-0 left-0 bottom-16 z-[60] w-screen bg-neutral-950/98 shadow-2xl flex flex-col md:hidden backdrop-blur-xl overflow-hidden"
          >
            <div
              className="flex-1 flex flex-col overflow-y-auto"
              style={{
                paddingTop:    "5vh",
                paddingLeft:   "5vw",
                paddingRight:  "12px",
                paddingBottom: "28px",
                gap:           "4px",
              }}
            >

              {/* ── Brand ── */}
              <div style={{ ...rowPad }}>
                {companyData.logo ? (
                  <img
                    src={companyData.logo}
                    alt={companyData.companyName}
                    className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="h-8 w-8 bg-[var(--color-primary)] text-black font-black flex items-center justify-center rounded-lg text-sm select-none">
                    B
                  </div>
                )}
                {/* 10px gap after logo before welcome */}
                <p
                  className="text-gray-400 font-semibold tracking-wide"
                  style={{ fontSize: rowFs, marginTop: "10px" }}
                >
                  Welcome to BookWorld
                </p>
              </div>

              <Divider />

              {/* ── Auth ── */}
              <div style={{ ...rowPad }}>
                {user ? (
                  <div className="flex flex-col" style={{ gap: "2px" }}>
                    <span className="text-gray-500 font-bold" style={{ fontSize: subFs }}>
                      {user.name} · {user.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="font-bold tracking-wide hover:underline cursor-pointer text-left w-fit"
                      style={{ color: "#c8860a", fontSize: rowFs }}
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center" style={{ gap: "16px" }}>
                    <button
                      onClick={() => go("/login")}
                      className="font-bold tracking-wide hover:underline cursor-pointer"
                      style={{ color: "#c8860a", fontSize: rowFs }}
                    >
                      Login
                    </button>
                    <div className="w-px h-3 bg-white/20" />
                    <button
                      onClick={() => go("/signup")}
                      className="font-bold tracking-wide hover:underline cursor-pointer"
                      style={{ color: "#c8860a", fontSize: rowFs }}
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>

              <Divider />

              {user && (
                <>
                  <div style={{ ...rowPad }}>
                    <div className="grid grid-cols-2" style={{ gap: "12px" }}>
                      <button
                        onClick={() => go("/orders")}
                        className="flex items-center gap-2 font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                        style={{ fontSize: rowFs }}
                      >
                        <div className="relative">
                          <ShoppingBag size={18} className="text-[var(--color-primary)]" />
                          {ordersCount > 0 && (
                            <span
                              className="
                                absolute -top-1.5 -right-1.5
                                min-w-[14px] h-[14px] px-0.5
                                flex items-center justify-center
                                rounded-full bg-amber-600 text-white
                                text-[8px] font-bold leading-none
                                border border-neutral-950
                              "
                            >
                              {ordersCount}
                            </span>
                          )}
                        </div>
                        My Orders
                      </button>
                      <button
                        onClick={() => go("/wishlist")}
                        className="flex items-center gap-2 font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                        style={{ fontSize: rowFs }}
                      >
                        <div className="relative">
                          <Heart size={18} className="text-[var(--color-primary)]" />
                          {wishlistCount > 0 && (
                            <span
                              className="
                                absolute -top-1.5 -right-1.5
                                min-w-[14px] h-[14px] px-0.5
                                flex items-center justify-center
                                rounded-full bg-pink-700 text-white
                                text-[8px] font-bold leading-none
                                border border-neutral-950
                              "
                            >
                              {wishlistCount}
                            </span>
                          )}
                        </div>
                        Wishlist
                      </button>
                    </div>
                  </div>
                  <Divider />
                </>
              )}

              {/* ── Quick links ── */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  openRequestModal();
                }}
                className="w-full text-left font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                style={{ ...rowPad, fontSize: rowFs }}
              >
                Send Request Book
              </button>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  openGiftModal();
                }}
                className="w-full text-left font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                style={{ ...rowPad, fontSize: rowFs, color: "#c8860a" }}
              >
                Send Gift Card
              </button>
              
              <button
                onClick={() => go("/books?advanced=true")}
                className="w-full text-left font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                style={{ ...rowPad, fontSize: rowFs }}
              >
                Advanced Search
              </button>

              <Divider />

              {/* ── Browse section ── */}
              <div
                className="flex flex-col border border-#c8860a/5 bg-white/[0.2] rounded-xl"
                style={{ padding: "8px", gap: "0px" }}
              >

                <button
                  onClick={() => go("/books?featured=true")}
                  className="w-full text-left font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                  style={{ ...rowPad, fontSize: rowFs }}
                >
                  Featured Books
                </button>
                <Divider />

                <button
                  onClick={() => go("/books?highDiscount=true")}
                  className="w-full text-left font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                  style={{ ...rowPad, fontSize: rowFs }}
                >
                  High Discount Books
                </button>
                <Divider />

                {/* Categories */}
                <div className="flex flex-col">
                  <button
                    onClick={() => setAccordion((p) => (p === "categories" ? null : "categories"))}
                    className="w-full flex items-center justify-between cursor-pointer transition-colors duration-150 hover:text-white text-gray-300"
                    style={{ ...rowPad, fontSize: rowFs, fontWeight: 600 }}
                  >
                    <span>Categories</span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform duration-200 ${accordion === "categories" ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {accordion === "categories" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-neutral-900/40 border-l border-white/5"
style={{ marginLeft: "3px", paddingLeft: "3px", paddingTop: "3px" }}                      >
                        <div className="flex flex-col py-1">
                          {categories.length === 0 ? (
                            <span className="pl-2 italic text-gray-500" style={{ fontSize: subFs, paddingTop: "4px", paddingBottom: "4px" }}>
                              No categories
                            </span>
                          ) : (
                            categories.map((cat) => (
                              <button
                                key={cat._id}
                                onClick={() => go(`/books?category=${cat._id}`)}
                                className="text-left pl-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors cursor-pointer truncate"
                                style={{ fontSize: subFs, paddingTop: "4px", paddingBottom: "4px" }}
                              >
                                {cat.name}
                              </button>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Divider />

                {/* Authors */}
                <div className="flex flex-col">
                  <button
                    onClick={() => setAccordion((p) => (p === "authors" ? null : "authors"))}
                    className="w-full flex items-center justify-between cursor-pointer transition-colors duration-150 hover:text-white text-gray-300"
                    style={{ ...rowPad, fontSize: rowFs, fontWeight: 600 }}
                  >
                    <span>Authors</span>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform duration-200 ${accordion === "authors" ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {accordion === "authors" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-neutral-900/40 border-l border-white/5"
style={{ marginLeft: "3px", paddingLeft: "3px", paddingTop: "3px" }}                      >
                        <div className="flex flex-col py-1">
                          {authors.length === 0 ? (
                            <span className="pl-2 italic text-gray-500" style={{ fontSize: subFs, paddingTop: "4px", paddingBottom: "4px" }}>
                              No authors
                            </span>
                          ) : (
                            authors.map((auth) => (
                              <button
                                key={auth._id}
                                onClick={() => go(`/books?author=${auth._id}`)}
                                className="text-left pl-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors cursor-pointer truncate"
                                style={{ fontSize: subFs, paddingTop: "4px", paddingBottom: "4px" }}
                              >
                                {auth.name}
                              </button>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Divider />

                <button
                  onClick={() => go("/books?bestseller=true")}
                  className="w-full text-left font-bold text-gray-300 hover:text-white transition-colors cursor-pointer"
                  style={{ ...rowPad, fontSize: rowFs }}
                >
                  Best Sellers
                </button>

              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
