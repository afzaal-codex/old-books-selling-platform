import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";

const AdminSidebarDropdown = ({
  icon,
  label,
  items,
  collapsed = false,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* DROPDOWN BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-gray-400 border border-transparent hover:border-[var(--color-border)] transition-all duration-300 hover:bg-neutral-900/60 hover:text-[var(--color-primary)] cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl flex-shrink-0">
            {icon}
          </span>

          {!collapsed && (
            <span className="text-xs font-semibold uppercase tracking-wider">
              {label}
            </span>
          )}
        </div>

        {!collapsed && (
          <span>
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
      </button>

      {/* DROPDOWN ITEMS */}
      {open && !collapsed && (
        <div className="mt-2 space-y-1.5 pl-5 border-l border-[var(--color-border)] ml-6">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                flex items-center rounded-lg px-4 py-2 text-xs transition-all duration-300 border border-transparent

                ${
                  isActive
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20 font-bold"
                    : "text-gray-400 hover:bg-neutral-900 hover:text-white"
                }
              `
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSidebarDropdown;