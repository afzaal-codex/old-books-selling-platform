import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const AdminHeader = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-card-bg)] text-white">
      <div className="flex h-[80px] items-center justify-between px-4 md:px-6">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Dashboard Control Panel
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
              Bookstore Administration
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* NOTIFICATION */}
          <button 
            onClick={() => toast.success("No new notifications")}
            className="relative rounded-xl border border-[var(--color-border)] p-2.5 bg-black/40 text-gray-400 hover:text-[var(--color-primary)] cursor-pointer"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
          </button>

          {/* PROFILE */}
          <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] px-3 py-1.5 bg-black/20">
            <div className="hidden md:block text-left">
              <h3 className="text-xs font-bold text-white leading-tight">
                {import.meta.env.VITE_ADMIN_NAME || "Muhammad Afzal"}
              </h3>
              <p className="text-[9px] text-gray-550 font-bold uppercase tracking-widest mt-0.5">
                Super Admin
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;