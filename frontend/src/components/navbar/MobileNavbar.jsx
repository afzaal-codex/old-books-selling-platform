import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const MobileNavbar = ({ isOpen, setIsOpen }) => {
  return (
    <button
      onClick={() => setIsOpen((p) => !p)}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      className="
        flex md:hidden items-center justify-center
        w-10 h-10 rounded-xl
        border border-white/10
        bg-white/5 hover:bg-white/10
        text-gray-300
        hover:scale-105 active:scale-95
        transition-all duration-150
        cursor-pointer outline-none
      "
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.span
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ display: "flex" }}
          >
            <X size={20} />
          </motion.span>
        ) : (
          <motion.span
            key="open"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ display: "flex" }}
          >
            <Menu size={20} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default MobileNavbar;