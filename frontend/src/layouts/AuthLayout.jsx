import { Outlet, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import companyData from "../data/companyData";

const AuthLayout = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <motion.div
      initial={isMobile ? { y: "-100%" } : {}}
      animate={isMobile ? { y: 0 } : {}}
      transition={isMobile ? { type: "spring", damping: 30, stiffness: 220 } : { duration: 0 }}
      className="
        fixed inset-0 z-50 h-screen w-screen bg-neutral-950/98 backdrop-blur-xl overflow-y-auto px-4 py-6 flex flex-col
        md:relative md:inset-auto md:z-10 md:h-auto md:w-auto md:min-h-screen md:items-center md:justify-center md:bg-[var(--color-bg)] md:px-4 md:py-10 md:overflow-visible
      "
    >
      {/* MOBILE HEADER */}
      <div className="flex md:hidden items-center justify-between w-full pb-4 mb-6 border-b border-white/10 z-20 flex-shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-semibold text-gray-350 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} className="text-[var(--color-primary)]" />
          <span>Back</span>
        </button>
        {companyData.logo ? (
          <img
            src={companyData.logo}
            alt={companyData.companyName}
            className="h-8 w-8 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="h-8 w-8 bg-[var(--color-primary)] text-black font-black flex items-center justify-center rounded-lg text-sm select-none">
            B
          </div>
        )}
      </div>

      {/* BACKGROUND EFFECT */}
      <div className="hidden md:block absolute left-0 top-0 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
      <div className="hidden md:block absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />

      {/* AUTH CONTAINER */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto flex-1 flex flex-col justify-center">
        <Outlet />
      </div>
    </motion.div>
  );
};

export default AuthLayout;