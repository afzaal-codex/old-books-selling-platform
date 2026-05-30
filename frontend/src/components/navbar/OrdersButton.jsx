import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useEffect, useRef } from "react";
import { fetchMyOrders } from "../../store/slices/orderSlice";

const OrdersButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { myOrders } = useSelector((state) => state.orders);
  const count = myOrders?.length ?? 0;
  const badgeRef = useRef(null);
  const prevCount = useRef(count);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyOrders());
    }
  }, [isAuthenticated, dispatch]);

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
      onClick={() => navigate("/orders")}
      aria-label={`Orders, ${count} total`}
      className="group relative flex items-center justify-center w-11 h-11 cursor-pointer outline-none"
    >
      <div className="relative">
        <ShoppingBag
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
              bg-amber-600 text-white
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

export default OrdersButton;