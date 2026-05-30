import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Search } from "lucide-react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import CartButton from "./CartButton";
import WishlistButton from "./WishlistButton";
import OrdersButton from "./OrdersButton";
import UserMenu from "./UserMenu";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import MobileSidebar from "./MobileSidebar";
import SecondaryNav from "./SecondaryNav";
import BottomNavigation from "./BottomNavigation";
import { fetchMyOrders } from "../../store/slices/orderSlice";

const DiscountStrip = ({ strip }) => {
  if (!strip || !strip.isActive) return null;
  const items = [strip.text, strip.promotionalLabel, strip.offerContent, strip.announcement].filter(Boolean);
  if (items.length === 0) return null;
  const text = items.join("   •   ") + "   •   ";
  return (
    <div style={{
      background: strip.backgroundColor || "#c8860a",
      color: strip.textColor || "#ffffff",
      fontSize: "clamp(11px, 1.9vw, 13px)", fontWeight: 800, letterSpacing: "0.07em",
      textTransform: "uppercase", padding: "9px 0",
      overflow: "hidden", whiteSpace: "nowrap", width: "100%", position: "relative",
      margin: 0,
      borderRadius: 0,
      lineHeight: 1.35,
    }} className="z-50 w-full">
      <div style={{ display: "flex", width: "max-content" }}>
        <div style={{ display: "inline-block", flexShrink: 0, paddingRight: "4px", animation: "discount-marquee 55s linear infinite" }}>
          {text} {text} {text} {text}
        </div>
        <div style={{ display: "inline-block", flexShrink: 0, paddingRight: "4px", animation: "discount-marquee 55s linear infinite" }}>
          {text} {text} {text} {text}
        </div>
      </div>
      <style>{`
        @keyframes discount-marquee { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }
      `}</style>
    </div>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.cms);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { myOrders } = useSelector((state) => state.orders);

  const headerWrapRef = useRef(null);
  const stripRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, isAuthenticated]);

  const totalSpent = myOrders
    .filter((order) => order.orderStatus !== "Cancelled")
    .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateHeaderMetrics = () => {
      const headerHeight = headerWrapRef.current?.offsetHeight || 0;
      const stripHeight = stripRef.current?.offsetHeight || 0;
      document.documentElement.style.setProperty("--site-header-height", `${headerHeight}px`);
      document.documentElement.style.setProperty("--site-strip-height", `${stripHeight}px`);
    };

    updateHeaderMetrics();
    const observer = window.ResizeObserver ? new ResizeObserver(updateHeaderMetrics) : null;
    if (observer && headerWrapRef.current) observer.observe(headerWrapRef.current);
    window.addEventListener("resize", updateHeaderMetrics);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateHeaderMetrics);
    };
  }, [settings?.discountStrip]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/books?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  return (
    <>
      <div ref={headerWrapRef} className="sticky top-0 z-50 w-full">
      <div ref={stripRef}>
        <DiscountStrip strip={settings?.discountStrip} />
      </div>
      <header
        style={{ marginBottom: "3px" }}
        className={`
          w-full transition-all duration-300
          ${
            isScrolled
              ? "border-b border-white/8 bg-[var(--color-card-bg)]/95 shadow-xl backdrop-blur-xl"
              : "bg-[var(--color-bg)]/80 backdrop-blur-xl border-b border-white/5 shadow-md"
          }
        `}
      >
        {/* ── Main navbar row ── */}
        <div className="container-custom">
          <div className="flex h-14 md:h-[72px] pb-[2px] md:pb-0 items-center justify-between gap-6">

            {/* LEFT — Logo */}
            <div className="flex items-center flex-shrink-0">
              <Logo />
            </div>

            {/* CENTER — Search */}
            <div className="hidden lg:flex flex-1 justify-center px-4">
              <SearchBar />
            </div>

            {/* RIGHT — Icons + User */}
            <div className="flex items-center flex-shrink-0">

              {/* Desktop icons */}
              <div className="hidden md:flex items-center">
                {isAuthenticated && (
                  <div className="text-xs font-extrabold text-[#c8860a] mr-4 flex flex-col items-end leading-tight select-none">
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Total Spent</span>
                    <span>Rs. {totalSpent.toLocaleString()}</span>
                  </div>
                )}

                {isAuthenticated && <WishlistButton />}
                {isAuthenticated && <OrdersButton />}
                <CartButton />

                {/* Divider */}
                <div className="w-px h-6 bg-white/10 mx-3" />

                <UserMenu />
              </div>

              {/* Mobile: User/Login only (no hamburger) */}
              <div className="flex md:hidden items-center">
                {isAuthenticated && (
                  <div className="text-[10px] font-extrabold text-[#c8860a] mr-3 flex flex-col items-end leading-none select-none">
                    <span className="text-[7.5px] text-gray-500 uppercase tracking-wider font-semibold">Spent</span>
                    <span>Rs. {totalSpent.toLocaleString()}</span>
                  </div>
                )}
                <UserMenu />
              </div>

            </div>
          </div>
        </div>

        {/* Mobile Search Bar Row (desktop styled, compact, covers full width, 1px padding) */}
        <div className="block lg:hidden container-custom px-[1px] pb-3">
          <SearchBar isMobile={true} />
        </div>

        {/* ── Secondary nav row — desktop only ── */}
        <SecondaryNav />
      </header>
      </div>

      <MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <BottomNavigation isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Header;
