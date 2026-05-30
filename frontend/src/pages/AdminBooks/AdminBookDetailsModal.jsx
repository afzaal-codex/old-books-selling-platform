import { X, TrendingUp, DollarSign, ShoppingCart, Percent } from "lucide-react";

const AdminBookDetailsModal = ({ book, setSelectedBook }) => {
  if (!book) return null;

  const hasDiscount = book.discountedPrice > 0 && book.discountedPrice < book.originalPrice;
  const price = hasDiscount ? book.discountedPrice : book.originalPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5 animate-fadeIn">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-[var(--color-card-bg)] border border-[var(--color-border)] p-6 md:p-8 text-white relative shadow-2xl space-y-6">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setSelectedBook(null)}
          className="absolute right-6 top-6 p-2 rounded-xl bg-neutral-900 border border-[var(--color-border)] hover:border-red-500 hover:text-red-500 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* MODAL HEADER */}
        <div>
          <h2 className="text-2xl font-black text-[var(--color-primary)]">Title Analytics Report</h2>
          <p className="text-xs text-gray-400 mt-1">Detailed statistics, sales performance, and parameters</p>
        </div>

        {/* MAIN BODY GRID */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Cover & metadata */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-neutral-950 border border-[var(--color-border)] rounded-2xl p-4 flex items-center justify-center min-h-[220px]">
              <img
                src={book.images?.[0] || "https://placehold.co/150x220?text=Book"}
                alt={book.title}
                className="max-h-[200px] object-contain rounded-lg border border-neutral-850 shadow"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-base line-clamp-2">{book.title}</h3>
              <p className="text-xs text-gray-400">By {book.author?.name}</p>
              <p className="text-xs text-gray-400">Category: {book.category?.name}</p>
              <p className="text-[10px] text-gray-500">ID: {book._id}</p>
            </div>
          </div>

          {/* Stats blocks & description */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick stats widgets */}
            <div className="grid gap-4 grid-cols-2">
              <div className="bg-neutral-950 border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-3">
                <div className="bg-[var(--color-primary)]/10 p-2.5 rounded-xl border border-[var(--color-primary)]/20 text-[var(--color-primary)]">
                  <DollarSign size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold uppercase">Revenue Generated</span>
                  <span className="text-base font-bold text-white">{book.totalRevenue || 0} PKR</span>
                </div>
              </div>

              <div className="bg-neutral-950 border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-3">
                <div className="bg-[var(--color-accent)]/10 p-2.5 rounded-xl border border-[var(--color-accent)]/20 text-[var(--color-accent)]">
                  <ShoppingCart size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold uppercase">Copies Sold</span>
                  <span className="text-base font-bold text-white">{book.totalQuantitySold || 0} units</span>
                </div>
              </div>

              <div className="bg-neutral-950 border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-3">
                <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 text-gray-300">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold uppercase">Total Orders</span>
                  <span className="text-base font-bold text-white">{book.totalOrders || 0} orders</span>
                </div>
              </div>

              <div className="bg-neutral-950 border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-3">
                <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 text-gray-300">
                  <Percent size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold uppercase">Computed Profit</span>
                  <span className="text-base font-bold text-white">{book.totalProfit || 0} PKR</span>
                </div>
              </div>
            </div>

            {/* Description & parameters details */}
            <div className="space-y-4 bg-neutral-950 border border-[var(--color-border)] rounded-2xl p-5 text-xs text-gray-300">
              <h4 className="font-bold text-white text-sm">Specification Metrics</h4>
              <div className="grid grid-cols-2 border-b border-neutral-900 pb-2">
                <span>Stock Remaining:</span>
                <span className="font-semibold text-white">{book.stock} copies</span>
              </div>
              <div className="grid grid-cols-2 border-b border-neutral-900 pb-2">
                <span>Binding Format:</span>
                <span className="font-semibold text-white">{book.bindingType}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-neutral-900 pb-2">
                <span>Used condition note:</span>
                <span className="font-semibold text-white text-right italic">{book.conditionDetails || "None"}</span>
              </div>
              <div className="grid grid-cols-2">
                <span>Average rating:</span>
                <span className="font-semibold text-yellow-500">⭐ {book.averageRating || "0.0"} ({book.totalReviews || 0} reviews)</span>
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="space-y-4 bg-neutral-950 border border-[var(--color-border)] rounded-2xl p-5 text-xs text-gray-300">
              <h4 className="font-bold text-white text-sm">Order Status Distribution</h4>
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl">
                  <span className="text-[10px] text-yellow-500 font-bold uppercase block">Pending</span>
                  <span className="text-lg font-extrabold text-white mt-1 block">{book.pendingOrders || 0}</span>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block">Delivered</span>
                  <span className="text-lg font-extrabold text-white mt-1 block">{book.deliveredOrders || 0}</span>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl">
                  <span className="text-[10px] text-red-400 font-bold uppercase block">Cancelled</span>
                  <span className="text-lg font-extrabold text-white mt-1 block">{book.cancelledOrders || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookDetailsModal;