import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  FolderKanban,
  PenSquare,
  ShoppingCart,
  CreditCard,
  Users,
  Tags,
  Percent,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import AdminSidebarItem from "./AdminSidebarItem";
import companyData from "../../data/companyData";

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside
      className="sticky top-0 hidden h-screen border-r border-[var(--color-border)] bg-[var(--color-card-bg)] lg:flex lg:flex-col relative flex-shrink-0"
      style={{
        width: collapsed ? "80px" : "290px",
        minWidth: collapsed ? "80px" : "290px",
        transition: "width 300ms cubic-bezier(0.4, 0, 0.2, 1), min-width 300ms cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      {/* LOGO */}
      <div className={`flex items-center border-b border-[var(--color-border)] p-5 ${collapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex items-center gap-3">
          {companyData.logo ? (
            <img
              src={companyData.logo}
              alt={companyData.companyName}
              className="h-10 w-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="h-10 w-10 bg-[var(--color-primary)] text-black font-black flex items-center justify-center rounded-xl text-lg select-none flex-shrink-0">
              B
            </div>
          )}

          {!collapsed && (
            <div>
              <h2 className="text-sm font-bold text-white tracking-wider">
                BookWorld
              </h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Admin Panel
              </p>
            </div>
          )}
        </div>

        {!collapsed ? (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg bg-black/40 border border-[var(--color-border)] p-2 text-gray-400 hover:text-[var(--color-primary)] cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-6 z-50 rounded-full bg-black border border-[var(--color-border)] p-1.5 text-gray-400 hover:text-[var(--color-primary)] cursor-pointer shadow-md"
          >
            <ChevronRight size={12} />
          </button>
        )}
      </div>

      {/* NAVIGATION */}
      <div className={`flex-1 space-y-1.5 overflow-y-auto custom-scrollbar ${collapsed ? "p-2" : "p-4"}`}>
        <AdminSidebarItem
          to="/admin"
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          collapsed={collapsed}
        />

        <AdminSidebarItem
          to="/admin/books"
          icon={<BookOpen size={18} />}
          label="All Books"
          collapsed={collapsed}
        />

        <AdminSidebarItem
          to="/admin/offers-this-week"
          icon={<Percent size={18} />}
          label="Offers This Week"
          collapsed={collapsed}
        />

        <AdminSidebarItem
          to="/admin/add-book"
          icon={<PlusCircle size={18} />}
          label="Add Book"
          collapsed={collapsed}
        />

        <AdminSidebarItem
          to="/admin/categories"
          icon={<FolderKanban size={18} />}
          label="Categories"
          collapsed={collapsed}
        />

        <AdminSidebarItem
          to="/admin/authors"
          icon={<PenSquare size={18} />}
          label="Authors"
          collapsed={collapsed}
        />

        <AdminSidebarItem
          to="/admin/orders"
          icon={<ShoppingCart size={18} />}
          label="Orders"
          collapsed={collapsed}
        />

        <AdminSidebarItem
          to="/admin/payments"
          icon={<CreditCard size={18} />}
          label="Payments"
          collapsed={collapsed}
        />

        <AdminSidebarItem
          to="/admin/users"
          icon={<Users size={18} />}
          label="Users"
          collapsed={collapsed}
        />

        <AdminSidebarItem
          to="/admin/coupons"
          icon={<Tags size={18} />}
          label="Coupons"
          collapsed={collapsed}
        />

        <AdminSidebarItem
          to="/admin/discounts"
          icon={<Percent size={18} />}
          label="Discounts"
          collapsed={collapsed}
        />

        <AdminSidebarItem
          to="/admin/notifications"
          icon={<Bell size={18} />}
          label="Notifications"
          collapsed={collapsed}
        />

        <AdminSidebarItem
          to="/admin/requests"
          icon={<Inbox size={18} />}
          label="Book Requests"
          collapsed={collapsed}
        />

        <AdminSidebarItem
          to="/admin/emails"
          icon={<Mail size={18} />}
          label="Email Config"
          collapsed={collapsed}
        />

        <AdminSidebarItem
          to="/admin/newsletter"
          icon={<Mail size={18} />}
          label="Newsletter"
          collapsed={collapsed}
        />

        <AdminSidebarItem
          to="/admin/cms"
          icon={<Settings size={18} />}
          label="CMS Settings"
          collapsed={collapsed}
        />

        <AdminSidebarItem
          to="/admin/security"
          icon={<ShieldCheck size={18} />}
          label="Security"
          collapsed={collapsed}
        />
      </div>

      {/* FOOTER */}
      <div className={`border-t border-[var(--color-border)] bg-black/20 ${collapsed ? "p-2" : "p-4"}`}>
        <button
          onClick={handleLogout}
          className={`flex w-full items-center rounded-xl text-red-500 hover:text-red-400 hover:bg-red-950/20 transition-all duration-300 border border-transparent hover:border-red-900/25 cursor-pointer ${collapsed ? "justify-center p-3" : "gap-3 px-4 py-3"}`}
        >
          <LogOut size={18} />

          {!collapsed && (
            <span className="text-xs font-bold uppercase tracking-wider">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
