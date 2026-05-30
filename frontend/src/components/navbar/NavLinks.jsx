import { NavLink } from "react-router-dom";
import { navigationLinks } from "../../data/navigationData";

const NavLinks = ({ mobile = false, onClick }) => {
  return (
    <>
      {navigationLinks.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onClick}
          className={({ isActive }) =>
            `relative transition-all duration-200
            ${
              mobile
                ? "flex items-center w-full px-6 py-[22px] text-2xl font-semibold tracking-wide border-b border-white/10"
                : "text-sm font-medium"
            }
            ${
              isActive
                ? "text-[var(--color-primary)]"
                : mobile
                ? "text-gray-200 hover:text-white"
                : "text-gray-300 hover:text-[var(--color-primary)]"
            }`
          }
        >
          {({ isActive }) => (
            <div className="relative flex items-center w-full">
              <span>{item.label}</span>
              {!mobile && isActive && (
                <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-[var(--color-primary)]" />
              )}
            </div>
          )}
        </NavLink>
      ))}
    </>
  );
};

export default NavLinks;