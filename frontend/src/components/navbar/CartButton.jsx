import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useEffect, useRef } from "react";

const CartButton = () => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const badgeRef = useRef(null);
  const prevCount = useRef(count);

  useEffect(() => {
    if (badgeRef.current && count > 0 && count !== prevCount.current) {
      badgeRef.current.classList.remove("badge-pop");
      void badgeRef.current.offsetWidth;
      badgeRef.current.classList.add("badge-pop");
    }
    prevCount.current = count;
  }, [count]);

  return (
    <button
      onClick={() => navigate("/cart")}
      aria-label={`Cart, ${count} items`}
      className="group relative flex items-center justify-center w-11 h-11 cursor-pointer outline-none"
    >
      <div className="relative">
        <ShoppingCart
          size={22}
          strokeWidth={1.8}
          className="text-gray-400 group-hover:text-amber-400 transition-colors duration-150"
        />
        {count > 0 && (
          <span
            ref={badgeRef}
            className="
              badge-pop
              absolute -top-1.5 -right-1.5
              min-w-[16px] h-[16px] px-0.5
              flex items-center justify-center
              rounded-full
              bg-gray-500 text-white
              text-[9px] font-semibold leading-none
              border border-[var(--color-bg,#0f0f0f)]
              badge-pulse
            "
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </div>
    </button>
  );
};

export default CartButton;