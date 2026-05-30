import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import BookCard from "../../components/books/BookCard";
import { Percent, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PageLoader from "../../components/loaders/PageLoader";
import SeoHead from "../../components/common/SeoHead";

const Offers = () => {
  const [books, setBooks] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksRes, settingsRes] = await Promise.all([
          axiosInstance.get("/books/high-discounts"),
          axiosInstance.get("/cms"),
        ]);
        setBooks(booksRes.data.books || []);
        setSettings(settingsRes.data || null);
      } catch (error) {
        console.error("Failed to load offers page data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <PageLoader label="Loading Offers" />;
  }

  return (
      <SeoHead page="Special Offers" />
      <div className="space-y-8 bg-[var(--color-bg)] text-white pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">Hot Offers & Discounts</h1>
        <p className="text-sm text-gray-400 mt-2">Get popular reads at unmatched bargain rates</p>
      </div>

      {/* PROMOTIONAL CAMPAIGN BANNER */}
      {settings?.promotionalDiscount?.isActive && (
        <div className="relative overflow-hidden rounded-3xl border border-[var(--color-primary)] bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 shadow-[0_4px_30px_rgba(212,175,55,0.15)] transition duration-300">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 h-64 w-64 rounded-full bg-[var(--color-primary)] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-12 -mb-12 h-64 w-64 rounded-full bg-[var(--color-accent)] opacity-10 blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-xs font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20 uppercase tracking-widest">
                <Sparkles size={12} /> Campaign Spotlight
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
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
        </div>
      )}

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-card-bg)] p-8">
          <Percent size={48} className="text-gray-500 mb-4" />
          <p className="text-gray-400 text-lg font-semibold">No discounted offers available at the moment</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Offers;
