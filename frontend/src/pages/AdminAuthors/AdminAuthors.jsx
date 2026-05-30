import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthors, createAuthorAction, updateAuthorAction, deleteAuthorAction } from "../../store/slices/authorSlice";
import { fetchBooks } from "../../store/slices/bookSlice";
import { fetchAllOrders } from "../../store/slices/orderSlice";
import toast from "react-hot-toast";
import { User, Edit2, Trash2, Plus, RefreshCw, PenTool } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const AdminAuthors = () => {
  const dispatch = useDispatch();

  const { authors, loading } = useSelector((state) => state.authors);
  const { books } = useSelector((state) => state.books);
  const { orders } = useSelector((state) => state.orders);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [featured, setFeatured] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadingImage(true);
    const toastId = toast.loading("Uploading author photo...");

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
    dispatch(fetchAuthors());
    dispatch(fetchBooks());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const formData = { name: name.trim(), slug, bio: bio.trim(), image, featured };

    try {
      if (editingId) {
        await dispatch(updateAuthorAction({ id: editingId, formData })).unwrap();
        toast.success("Author updated successfully!");
      } else {
        await dispatch(createAuthorAction(formData)).unwrap();
        toast.success("Author created successfully!");
      }
      resetForm();
      dispatch(fetchAuthors());
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleEdit = (auth) => {
    setEditingId(auth._id);
    setName(auth.name);
    setBio(auth.bio || "");
    setImage(auth.image || "");
    setFeatured(auth.featured || false);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this author?")) return;
    try {
      await dispatch(deleteAuthorAction(id)).unwrap();
      toast.success("Author deleted");
      dispatch(fetchAuthors());
    } catch (error) {
      toast.error(error.message || "Failed to delete author");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setBio("");
    setImage("");
    setFeatured(false);
    setShowForm(false);
  };

  // Aggregate author stats
  const getAuthorStats = (authId) => {
    const authBooks = books.filter((b) => b.author?._id === authId || b.author === authId);
    const bookIds = authBooks.map((b) => b._id.toString());

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
      booksCount: authBooks.length,
      ordersCount: totalOrders,
      revenue: totalRevenue,
    };
  };

  if (loading && authors.length === 0) {
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
          <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">Author Management</h1>
          <p className="text-sm text-gray-400 mt-2">Manage authors profiles, biographies, and sales statistics</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] text-black px-5 py-3 text-xs font-bold transition hover:opacity-90 cursor-pointer"
        >
          <Plus size={16} /> Add Author
        </button>
      </div>

      {/* AUTHOR FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5 animate-fadeIn">
          <form onSubmit={handleSubmit} className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 w-full max-w-lg space-y-6 shadow-2xl relative">
            <h2 className="font-extrabold text-lg text-[var(--color-primary)]">
              {editingId ? "Edit Author Details" : "Add New Author"}
            </h2>

            <div className="space-y-4 text-sm">
              <div className="space-y-2">
                <label className="text-gray-300">Author Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 block font-semibold text-xs">Profile Image</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-950/40 p-4 rounded-2xl border border-neutral-900">
                  {image ? (
                    <div className="relative group w-20 h-20 rounded-full overflow-hidden border border-[var(--color-border)] flex-shrink-0 bg-neutral-900">
                      <img src={image} alt="Author preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage("")}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold text-xs transition-opacity cursor-pointer border-0"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-neutral-800 flex items-center justify-center text-gray-500 text-xs flex-shrink-0 bg-neutral-900 font-bold">
                      No Photo
                    </div>
                  )}
                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      id="author-image-upload"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <label
                      htmlFor="author-image-upload"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-neutral-900 text-xs font-bold text-white hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50"
                    >
                      {uploadingImage ? "Uploading..." : image ? "Change Photo" : "Upload Photo"}
                    </label>
                    <p className="text-[10px] text-gray-500 mt-1">PNG, JPG, JPEG or WEBP up to 5MB.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-300">Biography / Overview</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Short bio description..."
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] resize-none"
                />
              </div>

              <label className="flex items-center gap-2 text-gray-300 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4"
                />
                Featured Author
              </label>
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
                {editingId ? "Update Author" : "Save Author"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AUTHORS LIST/TABLE */}
      <div className="overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-md">
        <table className="w-full border-collapse text-left text-sm text-white">
          <thead className="bg-neutral-900 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] border-b border-[var(--color-border)]">
            <tr>
              <th className="px-6 py-4">Avatar & Author Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Total Books</th>
              <th className="px-6 py-4">Orders Count</th>
              <th className="px-6 py-4">Revenue</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-850">
            {authors.map((auth) => {
              const authStats = getAuthorStats(auth._id);

              return (
                <tr key={auth._id} className="hover:bg-neutral-900/40 transition">
                  {/* Author avatar */}
                  <td className="px-6 py-4 flex items-center gap-4">
                    {auth.image ? (
                      <img src={auth.image} alt={auth.name} className="h-10 w-10 rounded-full object-cover border border-[var(--color-border)]" />
                    ) : (
                      <div className="h-10 w-10 bg-neutral-850 flex items-center justify-center rounded-full text-[var(--color-primary)] border border-neutral-750 font-bold">
                        {auth.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-gray-150 text-sm block">{auth.name}</span>
                      <span className="text-[10px] text-gray-500 block line-clamp-1 max-w-xs">{auth.bio || "No biography details."}</span>
                    </div>
                  </td>

                  {/* Status indicator */}
                  <td className="px-6 py-4">
                    {auth.featured ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)]">
                        Featured
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Standard</span>
                    )}
                  </td>

                  {/* Total Books count */}
                  <td className="px-6 py-4 font-semibold text-gray-200">
                    {authStats.booksCount} Titles
                  </td>

                  {/* Orders count */}
                  <td className="px-6 py-4 text-xs text-gray-300">
                    {authStats.ordersCount} orders
                  </td>

                  {/* Revenue */}
                  <td className="px-6 py-4 font-bold text-[var(--color-primary)]">
                    Rs. {authStats.revenue}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(auth)}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-gray-400 hover:text-white border border-transparent hover:border-neutral-750 transition cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(auth._id)}
                        className="p-2 hover:bg-red-950/20 rounded-lg text-red-500 hover:text-red-400 border border-transparent hover:border-red-900/30 transition cursor-pointer"
                        title="Delete Author"
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

export default AdminAuthors;
