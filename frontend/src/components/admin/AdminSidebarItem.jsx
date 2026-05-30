import { NavLink } from "react-router-dom";

const AdminSidebarItem = ({
  to,
  icon,
  label,
  collapsed = false,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        group flex items-center transition-all duration-300 border border-transparent

        ${
          collapsed
            ? "justify-center rounded-xl p-3"
            : "gap-3 rounded-xl px-4 py-3.5"
        }

        ${
          isActive
            ? "bg-[var(--color-primary)] text-black border-[var(--color-primary)] font-bold shadow-lg shadow-yellow-500/5"
            : "text-gray-400 hover:bg-neutral-900/60 hover:text-[var(--color-primary)] hover:border-[var(--color-border)]"
        }
      `
      }
    >
      {/* ICON */}
      <span className="text-xl flex-shrink-0">
        {icon}
      </span>

      {/* LABEL */}
      {!collapsed && (
        <span className="text-xs font-semibold uppercase tracking-wider">
          {label}
        </span>
      )}
    </NavLink>
  );
};

export default AdminSidebarItem;