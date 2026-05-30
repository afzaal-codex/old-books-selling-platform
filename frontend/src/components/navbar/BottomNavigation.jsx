import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, ShoppingCart, Menu } from "lucide-react";

const BottomNavigation = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useSelector((state) => state.cart);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const isHome = location.pathname === "/";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-neutral-950/95 border-t border-white/10 backdrop-blur-md py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="grid grid-cols-3 items-center w-full max-w-lg mx-auto h-12">
        {/* Left: Home */}
        <div className="flex justify-center w-full">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center transition-all duration-150 w-full ${
              isHome ? "text-[var(--color-primary)]" : "text-gray-400 hover:text-[var(--color-primary)]"
            }`}
          >
            <Home size={18} className={isHome ? "scale-105" : ""} />
            <span className={`text-[8px] font-bold mt-0.5 uppercase tracking-wider ${isHome ? "text-[var(--color-primary)]" : ""}`}>Home</span>
          </Link>
        </div>

        {/* Center: Cart */}
        <div className="flex justify-center w-full">
          <button
            onClick={() => navigate("/cart")}
            className="
              relative flex items-center justify-center
              w-10 h-10 rounded-full
              bg-[var(--color-primary)] text-black
              shadow-[0_2px_10px_rgba(212,175,55,0.3)]
              hover:scale-105 active:scale-95
              transition-all duration-150 cursor-pointer
            "
          >
            <ShoppingCart size={18} className="stroke-[2.5]" />
            {cartCount > 0 && (
              <span
                className="
                  absolute -top-1 -right-1
                  min-w-[15px] h-[15px] px-0.5
                  flex items-center justify-center
                  rounded-full bg-[var(--color-accent)] text-white
                  text-[8px] font-black leading-none
                  border border-neutral-950
                "
              >
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Right: Hamburger Menu */}
        <div className="flex justify-center w-full">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={`flex flex-col items-center justify-center transition-all duration-150 cursor-pointer w-full ${
              isOpen ? "text-[var(--color-primary)]" : "text-gray-400 hover:text-[var(--color-primary)]"
            }`}
          >
            <Menu size={18} className={isOpen ? "scale-105 rotate-90" : ""} />
            <span className={`text-[8px] font-bold mt-0.5 uppercase tracking-wider ${isOpen ? "text-[var(--color-primary)]" : ""}`}>Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
