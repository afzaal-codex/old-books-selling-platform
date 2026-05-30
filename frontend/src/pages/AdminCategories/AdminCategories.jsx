import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, createCategoryAction, updateCategoryAction, deleteCategoryAction } from "../../store/slices/categorySlice";
import { fetchBooks } from "../../store/slices/bookSlice";
import { fetchAllOrders } from "../../store/slices/orderSlice";
import toast from "react-hot-toast";
import { Folder, Edit2, Trash2, Plus, RefreshCw, Layers } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const AdminCategories = () => {
  const dispatch = useDispatch();

  const { categories, loading } = useSelector((state) => state.categories);
  const { books } = useSelector((state) => state.books);
  const { orders } = useSelector((state) => state.orders);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [featured, setFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);
    const toastId = toast.loading("Uploading category image...");

    try {
      const response = await axiosInstance.post("/cms/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImage(response.data.url);
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image", { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBooks());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const formData = { name: name.trim(), slug, image, featured, isActive };

    try {
      if (editingId) {
        await dispatch(updateCategoryAction({ id: editingId, formData })).unwrap();
        toast.success("Category updated successfully!");
      } else {
        await dispatch(createCategoryAction(formData)).unwrap();
        toast.success("Category created successfully!");
      }
      resetForm();
      dispatch(fetchCategories());
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setImage(cat.image || "");
    setFeatured(cat.featured || false);
    setIsActive(cat.isActive !== false);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await dispatch(deleteCategoryAction(id)).unwrap();
      toast.success("Category deleted");
      dispatch(fetchCategories());
    } catch (error) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  const toggleStatus = async (cat) => {
    try {
      const activeState = cat.isActive === false ? true : false;
      await dispatch(updateCategoryAction({ id: cat._id, formData: { isActive: activeState } })).unwrap();
      toast.success(`Category ${activeState ? "activated" : "deactivated"}`);
      dispatch(fetchCategories());
    } catch (error) {
      toast.error("Failed to toggle status");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setImage("");
    setFeatured(false);
    setIsActive(true);
    setShowForm(false);
  };

  // Aggregate category stats
  const getCategoryStats = (catId) => {
    const catBooks = books.filter((b) => b.category?._id === catId || b.category === catId);
    const bookIds = catBooks.map((b) => b._id.toString());

    let totalOrders = 0;
    let totalRevenue = 0;

    orders.forEach((order) => {
      let containsBook = false;
      order.orderItems.forEach((item) => {
        if (item.book && bookIds.includes(item.book.toString())) {
          containsBook = true;
          if (order.orderStatus !== "Cancelled") {
            totalRevenue += item.price * item.quantity;
          }
        }
      });
      if (containsBook) {
        totalOrders++;
      }
    });

    return {
      booksCount: catBooks.length,
      ordersCount: totalOrders,
      revenue: totalRevenue,
    };
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[var(--color-bg)] text-white pb-12">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">Category Management</h1>
          <p className="text-sm text-gray-400 mt-2">Create genres, edit features, and view sales performance</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] text-black px-5 py-3 text-xs font-bold transition hover:opacity-90 cursor-pointer"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* CATEGORY FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5 animate-fadeIn">
          <form onSubmit={handleSubmit} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 w-full max-w-lg space-y-6 shadow-2xl relative">
            <h2 className="font-extrabold text-lg text-[var(--color-primary)]">
              {editingId ? "Edit Category Details" : "Create New Category"}
            </h2>

            <div className="space-y-4 text-sm">
              <div className="space-y-2">
                <label className="text-gray-300">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 block font-semibold text-xs">Category Cover Image</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-950/40 p-4 rounded-2xl border border-neutral-900">
                  {image ? (
                    <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-[var(--color-border)] flex-shrink-0 bg-neutral-900">
                      <img src={image} alt="Category preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage("")}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold text-xs transition-opacity cursor-pointer border-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-neutral-800 flex items-center justify-center text-gray-500 text-xs flex-shrink-0 bg-neutral-900">
                      No Image
                    </div>
                  )}
                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      id="category-image-upload"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <label
                      htmlFor="category-image-upload"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-neutral-900 text-xs font-bold text-white hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50"
                    >
                      {uploadingImage ? "Uploading..." : image ? "Change Image" : "Upload Image"}
                    </label>
                    <p className="text-[10px] text-gray-500 mt-1">PNG, JPG, JPEG or WEBP up to 5MB.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Featured Category
                </label>

                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4"
                  />
                  Active Status
                </label>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 text-xs rounded-xl bg-neutral-900 border border-[var(--color-border)] hover:border-red-500 hover:text-red-500 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-xs rounded-xl bg-[var(--color-primary)] text-black font-bold hover:opacity-90 transition cursor-pointer"
              >
                {editingId ? "Update Category" : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CATEGORIES GRID/TABLE */}
      <div className="overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-md">
        <table className="w-full border-collapse text-left text-sm text-white">
          <thead className="bg-neutral-900 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] border-b border-[var(--color-border)]">
            <tr>
              <th className="px-6 py-4">Cover & Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total Books</th>
              <th className="px-6 py-4">Orders Count</th>
              <th className="px-6 py-4">Revenue</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-850">
            {categories.map((cat) => {
              const catStats = getCategoryStats(cat._id);
              const isCatActive = cat.isActive !== false;

              return (
                <tr key={cat._id} className="hover:bg-neutral-900/40 transition">
                  {/* Category info */}
                  <td className="px-6 py-4 flex items-center gap-4">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="h-10 w-10 rounded-lg object-cover border border-[var(--color-border)]" />
                    ) : (
                      <div className="h-10 w-10 bg-neutral-850 flex items-center justify-center rounded-lg text-[var(--color-primary)] border border-neutral-750">
                        <Folder size={18} />
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-gray-150 text-sm block">{cat.name}</span>
                      <span className="text-[10px] text-gray-500 block">slug: {cat.slug}</span>
                    </div>
                  </td>

                  {/* Active/Featured Status */}
                  <td className="px-6 py-4 space-y-1">
                    <button
                      onClick={() => toggleStatus(cat)}
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                        isCatActive
                          ? "bg-emerald-950/20 border-emerald-800 text-emerald-400"
                          : "bg-red-950/20 border-red-850 text-red-400"
                      }`}
                    >
                      {isCatActive ? "Active" : "Inactive"}
                    </button>
                    {cat.featured && (
                      <span className="block w-fit px-2 py-0.5 rounded-md text-[9px] font-semibold bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)]">
                        Featured
                      </span>
                    )}
                  </td>

                  {/* Total Books count */}
                  <td className="px-6 py-4 font-semibold text-gray-200">
                    {catStats.booksCount} Titles
                  </td>

                  {/* Total Orders count */}
                  <td className="px-6 py-4 text-xs text-gray-300">
                    {catStats.ordersCount} orders
                  </td>

                  {/* Revenue */}
                  <td className="px-6 py-4 font-bold text-[var(--color-primary)]">
                    Rs. {catStats.revenue}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-gray-400 hover:text-white border border-transparent hover:border-neutral-750 transition cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-2 hover:bg-red-950/20 rounded-lg text-red-500 hover:text-red-400 border border-transparent hover:border-red-900/30 transition cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;
