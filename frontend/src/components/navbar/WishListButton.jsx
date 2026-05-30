import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useEffect, useRef } from "react";
import { fetchWishlist } from "../../store/slices/wishlistSlice";
import toast from "react-hot-toast";

const WishlistButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  const count = wishlist?.books?.length ?? 0;
  const badgeRef = useRef(null);
  const prevCount = useRef(count);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
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
      onClick={() => {
        if (!isAuthenticated) {
          toast.error("Please login to view your wishlist");
          navigate("/login");
          return;
        }
        navigate("/wishlist");
      }}
      aria-label={`Wishlist, ${count} items`}
      className="group relative flex items-center justify-center w-11 h-11 cursor-pointer outline-none"
    >
      <div className="relative">
        <Heart
          size={22}
          strokeWidth={1.8}
          className="text-gray-400 group-hover:text-pink-400 transition-colors duration-150"
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
              bg-pink-700 text-white
              text-[9px] font-semibold leading-none
              border border-[var(--color-bg,#0f0f0f)]
              badge-pulse-pink
            "
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </div>
    </button>
  );
};

export default WishlistButton;