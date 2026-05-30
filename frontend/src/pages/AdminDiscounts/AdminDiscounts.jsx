import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks, updateBookAction } from "../../store/slices/bookSlice";
import { fetchSettings, updateSettingsAction } from "../../store/slices/cmsSlice";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { Percent, Edit2, Check, X, Tag, Upload, Trash2, Megaphone } from "lucide-react";

const AdminDiscounts = () => {
  const dispatch = useDispatch();
  const { books, loading } = useSelector((state) => state.books);
  const { settings } = useSelector((state) => state.cms);
  
  const [editingId, setEditingId] = useState(null);
  const [discountPrice, setDiscountPrice] = useState("");

  // Campaign states
  const [campaignTitle, setCampaignTitle] = useState("");
  const [campaignSlogan, setCampaignSlogan] = useState("");
  const [campaignImage, setCampaignImage] = useState("");
  const [campaignDiscountValue, setCampaignDiscountValue] = useState("");
  const [campaignIsActive, setCampaignIsActive] = useState(false);
  const [uploadingCampaignImage, setUploadingCampaignImage] = useState(false);

  useEffect(() => {
    dispatch(fetchBooks());
    dispatch(fetchSettings());
  }, [dispatch]);

  // Sync campaign states with settings
  useEffect(() => {
    if (settings?.promotionalDiscount) {
      setCampaignTitle(settings.promotionalDiscount.title || "");
      setCampaignSlogan(settings.promotionalDiscount.slogan || "");
      setCampaignImage(settings.promotionalDiscount.image || "");
      setCampaignDiscountValue(settings.promotionalDiscount.discountValue || "");
      setCampaignIsActive(settings.promotionalDiscount.isActive || false);
    }
  }, [settings]);

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingCampaignImage(true);
      const formData = new FormData();
      formData.append("media", file);

      const res = await axiosInstance.post("/reviews/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success && res.data.files && res.data.files.length > 0) {
        setCampaignImage(res.data.files[0].url);
        toast.success("Campaign banner uploaded successfully!");
      } else {
        toast.error("Failed to upload banner");
      }
    } catch (error) {
      toast.error("Failed to upload banner");
    } finally {
      setUploadingCampaignImage(false);
    }
  };

  const handleSaveCampaign = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        promotionalDiscount: {
          title: campaignTitle,
          slogan: campaignSlogan,
          image: campaignImage,
          discountValue: Number(campaignDiscountValue) || 0,
          isActive: campaignIsActive,
        }
      };
      await dispatch(updateSettingsAction(payload)).unwrap();
      toast.success("Promotional campaign saved successfully!");
    } catch (error) {
      toast.error("Failed to save campaign");
    }
  };

  const handleStartEdit = (book) => {
    setEditingId(book._id);
    setDiscountPrice(book.discountedPrice || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDiscountPrice("");
  };

  const handleSaveDiscount = async (bookId, originalPrice) => {
    const dPrice = Number(discountPrice);
    if (isNaN(dPrice) || dPrice < 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (dPrice >= originalPrice) {
      toast.error("Discount price must be less than original price");
      return;
    }

    try {
      // Dispatch updating book action
      await dispatch(updateBookAction({ id: bookId, bookData: { discountedPrice: dPrice } })).unwrap();
      toast.success("Discount updated successfully!");
      setEditingId(null);
      dispatch(fetchBooks());
    } catch (error) {
      toast.error(error.message || "Failed to update discount");
    }
  };

  const handleRemoveDiscount = async (bookId) => {
    if (!window.confirm("Remove discount from this book?")) return;
    try {
      await dispatch(updateBookAction({ id: bookId, bookData: { discountedPrice: 0 } })).unwrap();
      toast.success("Discount removed");
      dispatch(fetchBooks());
    } catch (error) {
      toast.error("Failed to remove discount");
    }
  };

  const discountedBooks = books.filter((b) => b.discountedPrice > 0 && b.discountedPrice < b.originalPrice);
  const regularBooks = books.filter((b) => !b.discountedPrice || b.discountedPrice >= b.originalPrice);

  return (
    <div className="space-y-8 bg-[var(--color-bg)] text-white pb-12">
      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-5">
        <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">Discounts & Offers Manager</h1>
        <p className="text-sm text-gray-400 mt-2">Manage prices, apply direct discount tags, and review current catalog offers</p>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Discounted Titles</p>
            <p className="text-3xl font-extrabold text-[var(--color-primary)] mt-1">{discountedBooks.length}</p>
          </div>
          <div className="p-3 bg-yellow-500/10 rounded-xl text-[var(--color-primary)]">
            <Percent size={24} />
          </div>
        </div>
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Regular Priced Titles</p>
            <p className="text-3xl font-extrabold text-white mt-1">{regularBooks.length}</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <Tag size={24} />
          </div>
        </div>
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Store Catalog</p>
            <p className="text-3xl font-extrabold text-[var(--color-accent)] mt-1">{books.length}</p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-xl text-[var(--color-accent)]">
            <Tag size={24} />
          </div>
        </div>
      </div>

      {/* PROMOTIONAL CAMPAIGN BANNER FORM */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
          <Megaphone className="text-[var(--color-primary)]" size={22} />
          <div>
            <h2 className="text-xl font-bold">General Day-Wise Promo Campaign</h2>
            <p className="text-xs text-gray-500 mt-1">Configure homepage and offers promotional campaign banners with active discounts</p>
          </div>
        </div>

        <form onSubmit={handleSaveCampaign} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5 uppercase tracking-wider">Campaign Title</label>
              <input
                type="text"
                value={campaignTitle}
                onChange={(e) => setCampaignTitle(e.target.value)}
                placeholder="e.g. Eid Mubarak Special Sale"
                className="w-full bg-black border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)] outline-none transition"
              />
            </div>

            {/* Slogan */}
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5 uppercase tracking-wider">Campaign Slogan</label>
              <input
                type="text"
                value={campaignSlogan}
                onChange={(e) => setCampaignSlogan(e.target.value)}
                placeholder="e.g. Get 20% flat discount on all books this Eid!"
                className="w-full bg-black border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)] outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Discount Value */}
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5 uppercase tracking-wider">Discount Value (Flat/%)</label>
              <input
                type="number"
                value={campaignDiscountValue}
                onChange={(e) => setCampaignDiscountValue(e.target.value)}
                placeholder="e.g. 15"
                className="w-full bg-black border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)] outline-none transition"
              />
            </div>

            {/* Banner Image Upload */}
            <div>
              <label className="text-xs font-semibold text-gray-400 block mb-1.5 uppercase tracking-wider">Campaign Banner Image</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={campaignImage}
                  onChange={(e) => setCampaignImage(e.target.value)}
                  placeholder="Image URL or upload banner"
                  className="flex-1 bg-black border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-primary)] outline-none transition"
                />
                <label className="flex items-center gap-2 bg-neutral-900 border border-[var(--color-border)] text-gray-300 px-4 py-3 rounded-xl cursor-pointer hover:bg-neutral-800 transition text-sm whitespace-nowrap">
                  <Upload size={16} className="text-[var(--color-primary)]" />
                  {uploadingCampaignImage ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                    disabled={uploadingCampaignImage}
                  />
                </label>
              </div>
              {campaignImage && (
                <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-[var(--color-border)] bg-black">
                  <img src={campaignImage} alt="Campaign Banner Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setCampaignImage("")}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/90 text-red-500 rounded-lg transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 mt-2">
            {/* Status Switch */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-300">Campaign Status:</span>
              <button
                type="button"
                onClick={() => setCampaignIsActive(!campaignIsActive)}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none
                  ${campaignIsActive ? "bg-[var(--color-primary)]" : "bg-neutral-800"}
                `}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                    ${campaignIsActive ? "translate-x-5" : "translate-x-0"}
                  `}
                />
              </button>
              <span className={`text-xs font-bold ${campaignIsActive ? "text-green-500" : "text-gray-500"}`}>
                {campaignIsActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>

            <button
              type="submit"
              className="bg-[var(--color-primary)] hover:opacity-90 text-black font-extrabold text-sm px-6 py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
            >
              Save Campaign Settings
            </button>
          </div>
        </form>
      </div>

      {/* DISCOUNTS TABLE */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Percent size={18} className="text-[var(--color-primary)]" />
          Active Catalog Discounts
        </h2>

        {loading && books.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-gray-400">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-card-bg)] p-8">
            <p className="text-gray-450">No books found in the store catalog.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-md">
            <table className="w-full border-collapse text-left text-sm text-white">
              <thead className="bg-neutral-900 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-6 py-4">Book Title</th>
                  <th className="px-6 py-4">Original Price</th>
                  <th className="px-6 py-4">Discounted Price</th>
                  <th className="px-6 py-4">Discount (%)</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {books.map((book) => {
                  const hasDiscount = book.discountedPrice > 0 && book.discountedPrice < book.originalPrice;
                  const discountPercent = hasDiscount
                    ? Math.round(((book.originalPrice - book.discountedPrice) / book.originalPrice) * 100)
                    : 0;
                  const isEditing = editingId === book._id;

                  return (
                    <tr key={book._id} className="hover:bg-neutral-900/40 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {book.image && (
                            <img src={book.image} alt={book.title} className="h-10 w-8 object-cover rounded" />
                          )}
                          <div>
                            <span className="font-bold text-gray-200 block leading-tight">{book.title}</span>
                            <span className="text-xs text-gray-500 block">by {book.author?.name || book.author}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-400">
                        Rs. {book.originalPrice}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={discountPrice}
                            onChange={(e) => setDiscountPrice(e.target.value)}
                            placeholder="Discount Price"
                            className="bg-black border border-[var(--color-primary)] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none w-28"
                          />
                        ) : hasDiscount ? (
                          <span className="font-bold text-[var(--color-primary)]">Rs. {book.discountedPrice}</span>
                        ) : (
                          <span className="text-gray-500 italic text-xs">No Discount</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {hasDiscount ? (
                          <span className="inline-flex px-2 py-0.5 rounded bg-red-950/20 border border-red-800 text-red-400 text-xs font-bold">
                            {discountPercent}% Off
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveDiscount(book._id, book.originalPrice)}
                                className="p-1.5 hover:bg-emerald-950/20 text-emerald-500 hover:text-emerald-400 border border-emerald-900/20 rounded-lg transition"
                                title="Save"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1.5 hover:bg-red-950/20 text-red-500 hover:text-red-400 border border-red-900/20 rounded-lg transition"
                                title="Cancel"
                              >
                                <X size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEdit(book)}
                                className="p-2 hover:bg-neutral-800 rounded-lg text-gray-400 hover:text-white border border-transparent hover:border-neutral-750 transition"
                                title="Set Discount"
                              >
                                <Edit2 size={13} />
                              </button>
                              {hasDiscount && (
                                <button
                                  onClick={() => handleRemoveDiscount(book._id)}
                                  className="p-2 hover:bg-red-950/20 rounded-lg text-red-500 hover:text-red-400 border border-transparent hover:border-red-900/30 transition"
                                  title="Remove Discount"
                                >
                                  <X size={13} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDiscounts;
