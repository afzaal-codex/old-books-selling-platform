import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

const BestOffers = ({ settings }) => {
  if (!settings?.promotionalDiscount?.isActive) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[var(--color-primary)] bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 shadow-[0_4px_30px_rgba(212,175,55,0.15)] transition duration-300">
      <div className="absolute top-0 right-0 -mr-12 -mt-12 h-64 w-64 rounded-full bg-[var(--color-primary)] opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-12 -mb-12 h-64 w-64 rounded-full bg-[var(--color-accent)] opacity-10 blur-3xl"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20 uppercase tracking-widest">
            <Sparkles size={12} /> Special Promotion
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight" style={{ fontFamily: "Satoshi, system-ui, sans-serif" }}>
            {settings.promotionalDiscount.title}
          </h2>
          <p className="text-sm md:text-base text-gray-300 max-w-xl">
            {settings.promotionalDiscount.slogan}
          </p>
          {settings.promotionalDiscount.discountValue > 0 && (
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 rounded-xl bg-red-950/30 px-5 py-2.5 text-lg font-black text-[var(--color-accent)] border border-[var(--color-accent)]/30">
                Flat {settings.promotionalDiscount.discountValue}% OFF
              </span>
            </div>
          )}
          <div className="pt-4">
            <Link
              to="/books?highDiscount=true"
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-8 py-3.5 text-sm font-extrabold text-black hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
            >
              Shop Campaign Offers <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        {settings.promotionalDiscount.image && (
          <div className="w-full md:w-1/3 flex justify-center">
            <img
              src={settings.promotionalDiscount.image}
              alt={settings.promotionalDiscount.title}
              className="max-h-64 object-contain rounded-2xl shadow-xl border border-white/5"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default BestOffers;
