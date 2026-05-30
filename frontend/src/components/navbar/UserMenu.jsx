import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { User, LogOut, LayoutDashboard } from "lucide-react";

const UserMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const PROTECTED_PATHS = ["/checkout", "/orders", "/wishlist", "/profile"];

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    // If on a protected page, go home; otherwise stay on current page
    const isProtected = PROTECTED_PATHS.some((p) => location.pathname.startsWith(p));
    if (isProtected) navigate("/");
  };

  if (!token) {
    return (
      <Link
        to="/login"
        className="
          inline-flex items-center justify-center
          bg-transparent
          text-sm font-semibold tracking-wide
          transition-all duration-150
          hover:opacity-75
          active:scale-95
          outline-none
          whitespace-nowrap
        "
        style={{ color: "#c8860a", paddingLeft: "calc(1rem + 0.5px)", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
      >
        Login
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>

      {/* User icon button — desktop only */}
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label="User menu"
        className="
          flex items-center justify-center
          w-10 h-10 rounded-xl
          border border-white/10
          bg-white/5 hover:bg-white/10
          text-amber-400
          hover:scale-105 active:scale-95
          transition-all duration-150
          cursor-pointer outline-none
          focus-visible:ring-0
        "
        style={{ marginLeft: "3px" }}
      >
        <User size={20} />
      </button>

      {/* Desktop dropdown */}
      {open && (
        <div className="
          absolute right-0 top-14 z-50
          w-64
          border border-white/10
          bg-[var(--color-card-bg)]
          shadow-2xl
          animate-fade-in
          overflow-hidden
        ">
          {/* User info */}
          <div
            className="border-b border-white/10"
            style={{ padding: "calc(1rem + 3px) calc(1.25rem + 3px) 1rem 1.25rem" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-2">
            {isAdmin ? (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 text-sm text-gray-200 hover:bg-white/6 transition-colors"
                style={{ padding: "calc(0.875rem + 2px) 1.25rem calc(0.875rem + 2px) calc(1.25rem + 3px)" }}
              >
                <LayoutDashboard size={16} className="text-amber-400 flex-shrink-0" />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 text-sm text-gray-200 hover:bg-white/6 transition-colors"
                style={{ padding: "calc(0.875rem + 2px) 1.25rem calc(0.875rem + 2px) calc(1.25rem + 3px)" }}
              >
                <User size={16} className="text-amber-400 flex-shrink-0" />
                Profile
              </Link>
            )}

            <div className="my-1 border-t border-white/6" />

            <button
              onClick={handleLogout}
              className="
                w-full flex items-center gap-4
                text-sm text-red-400
                hover:bg-red-500/8 transition-colors
                cursor-pointer
              "
              style={{ padding: "calc(0.875rem + 2px) 1.25rem calc(0.875rem + 2px) calc(1.25rem + 3px)" }}
            >
              <LogOut size={16} className="flex-shrink-0" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;