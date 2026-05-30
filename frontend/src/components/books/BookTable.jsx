import { Eye, Edit2, Trash2, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";

const BookTable = ({ books, handleDelete, setSelectedBook }) => {
  const toggleFeatured = async (book, e) => {
    e.stopPropagation();
    try {
      await axiosInstance.put(`/books/${book._id}`, { featured: !book.featured });
      toast.success("Updated featured status");
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const toggleBestseller = async (book, e) => {
    e.stopPropagation();
    try {
      await axiosInstance.put(`/books/${book._id}`, { bestseller: !book.bestseller });
      toast.success("Updated bestseller status");
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const updateStockInline = async (book, e) => {
    e.stopPropagation();
    const newStock = prompt(`Update stock count for "${book.title}":`, book.stock);
    if (newStock === null || newStock === "") return;
    const count = parseInt(newStock, 10);
    if (isNaN(count) || count < 0) {
      toast.error("Please enter a valid non-negative number");
      return;
    }
    try {
      await axiosInstance.put(`/books/${book._id}`, { stock: count });
      toast.success("Stock count updated!");
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update stock");
    }
  };

  const safeBooks = Array.isArray(books) ? books.filter(b => b && b._id) : [];

  return (
    <div className="overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-md text-white">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-neutral-900 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] border-b border-[var(--color-border)]">
          <tr>
            <th className="px-6 py-4">Book Details</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Condition</th>
            <th className="px-6 py-4">Stock</th>
            <th className="px-6 py-4">Orders / Sold</th>
            <th className="px-6 py-4">Revenue</th>
            <th className="px-6 py-4">Toggles</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-850">
          {safeBooks.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                No books found inside this catalog listing.
              </td>
            </tr>
          ) : (
            safeBooks.map((book) => {
              const hasDiscount = book.discountedPrice > 0;
              const lowStock = book.stock <= 5;
              const isOut = book.stock === 0;

              return (
                <tr
                  key={book._id}
                  onClick={() => setSelectedBook(book)}
                  className="hover:bg-neutral-900/60 transition cursor-pointer"
                >
                  {/* Book Image and Name */}
                  <td className="px-6 py-4 flex items-center gap-4">
                    <img
                      src={book.images?.[0] || "https://placehold.co/50x70?text=Book"}
                      alt={book.title}
                      className="h-14 w-10 object-cover rounded-md border border-[var(--color-border)]"
                    />
                    <div>
                      <h4 className="font-bold text-gray-100 line-clamp-1 text-sm">{book.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">By {book.author?.name} | {book.category?.name}</p>
                    </div>
                  </td>

                  {/* Pricing details */}
                  <td className="px-6 py-4">
                    {hasDiscount ? (
                      <div>
                        <span className="font-semibold text-white block">{book.discountedPrice} PKR</span>
                        <span className="text-[10px] text-gray-500 line-through">{book.originalPrice} PKR</span>
                      </div>
                    ) : (
                      <span className="font-semibold text-white">{book.originalPrice} PKR</span>
                    )}
                  </td>

                  {/* Condition notes */}
                  <td className="px-6 py-4 text-xs font-semibold">
                    <span className={`px-2.5 py-1 rounded-full ${
                      book.condition === "New" ? "bg-emerald-950/30 text-emerald-450" : "bg-orange-950/30 text-orange-455"
                    }`}>
                      {book.condition} ({book.bookType || "New"})
                    </span>
                  </td>

                  {/* Stock count */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        onClick={(e) => updateStockInline(book, e)}
                        className={`font-semibold cursor-pointer border-b border-dashed hover:border-white transition px-1 py-0.5 rounded ${
                          isOut
                            ? "text-red-500 font-bold"
                            : lowStock
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                        title="Click to quickly update stock inline"
                      >
                        {book.stock} left
                      </span>
                      {lowStock && <AlertTriangle size={12} className="text-yellow-500" />}
                    </div>
                  </td>

                  {/* Orders and quantity sold */}
                  <td className="px-6 py-4 text-xs font-semibold">
                    <div className="space-y-0.5">
                      <span className="block text-gray-200">Orders: {book.totalOrders || 0}</span>
                      <span className="block text-gray-400">Sold: {book.totalQuantitySold || 0}</span>
                    </div>
                  </td>

                  {/* Revenue */}
                  <td className="px-6 py-4 font-bold text-[var(--color-primary)]">
                    {book.totalRevenue || 0} PKR
                  </td>

                  {/* Badge Toggles */}
                  <td className="px-6 py-4 space-y-1.5">
                    <button
                      onClick={(e) => toggleFeatured(book, e)}
                      className={`block px-2.5 py-1 rounded-md text-[10px] font-bold border transition cursor-pointer ${
                        book.featured
                          ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10"
                          : "border-neutral-800 text-gray-500 hover:text-gray-400"
                      }`}
                    >
                      Featured
                    </button>
                    <button
                      onClick={(e) => toggleBestseller(book, e)}
                      className={`block px-2.5 py-1 rounded-md text-[10px] font-bold border transition cursor-pointer ${
                        book.bestseller
                          ? "border-orange-500 text-orange-500 bg-orange-500/10"
                          : "border-neutral-800 text-gray-500 hover:text-gray-400"
                      }`}
                    >
                      Bestseller
                    </button>
                  </td>

                  {/* Actions buttons */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedBook(book)}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-blue-450 border border-transparent hover:border-neutral-750 transition cursor-pointer"
                        title="View Detailed Analytics"
                      >
                        <TrendingUp size={16} />
                      </button>
                      <Link
                        to={`/admin/books/edit/${book._id}`}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-gray-400 hover:text-white border border-transparent hover:border-neutral-750 transition"
                        title="Edit Book Details"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="p-2 hover:bg-red-950/20 rounded-lg text-red-500 hover:text-red-400 border border-transparent hover:border-red-900/30 transition cursor-pointer"
                        title="Delete Book"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;