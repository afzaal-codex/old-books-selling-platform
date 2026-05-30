import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { Ticket, Plus, Trash2, Calendar, Percent, Landmark, Check, X } from "lucide-react";
import dayjs from "dayjs";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form fields
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [active, setActive] = useState(true);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/coupons");
      setCoupons(res.data || []);
    } catch (error) {
      console.error("Failed to fetch coupons", error);
      toast.error("Failed to load coupons list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim() || !discountValue || !expiryDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      code: code.toUpperCase().replace(/\s+/g, ""),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
      usageLimit: usageLimit ? Number(usageLimit) : 1,
      expiryDate,
      active,
    };

    try {
      const res = await axiosInstance.post("/coupons", payload);
      toast.success("Coupon code created successfully!");
      setCoupons([res.data, ...coupons]);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create coupon code");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await axiosInstance.delete(`/coupons/${id}`);
      toast.success("Coupon deleted successfully");
      setCoupons(coupons.filter((c) => c._id !== id));
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  const resetForm = () => {
    setCode("");
    setDiscountType("percentage");
    setDiscountValue("");
    setMinOrderAmount("");
    setUsageLimit("");
    setExpiryDate("");
    setActive(true);
    setShowForm(false);
  };

  return (
    <div className="space-y-8 bg-[var(--color-bg)] text-white pb-12">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">Coupon Management</h1>
          <p className="text-sm text-gray-400 mt-2">Generate discount promo codes and monitor usage counts</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] text-black px-5 py-3 text-xs font-bold transition hover:opacity-90 cursor-pointer"
        >
          <Plus size={16} /> Create Promo Code
        </button>
      </div>

      {/* CREATE FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5 animate-fadeIn">
          <form
            onSubmit={handleSubmit}
            className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 w-full max-w-lg space-y-6 shadow-2xl relative"
          >
            <h2 className="font-extrabold text-lg text-[var(--color-primary)]">Create Discount Coupon</h2>

            <div className="grid gap-4 text-sm">
              <div className="space-y-2">
                <label className="text-gray-300 uppercase tracking-wider text-[10px] font-bold">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAVE20, BOOKBUFF"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-gray-300 uppercase tracking-wider text-[10px] font-bold">Discount Type *</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Rs.)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 uppercase tracking-wider text-[10px] font-bold">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder={discountType === "percentage" ? "e.g. 20" : "e.g. 250"}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-gray-300 uppercase tracking-wider text-[10px] font-bold">Min Order Value (Rs.)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 uppercase tracking-wider text-[10px] font-bold">Usage Limit</label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                  <label className="text-gray-300 uppercase tracking-wider text-[10px] font-bold">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6 pl-2">
                  <input
                    type="checkbox"
                    id="active-check"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <label htmlFor="active-check" className="text-sm text-gray-300 cursor-pointer">
                    Active Status
                  </label>
                </div>
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
                Create Coupon
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      {loading ? (
        <div className="flex h-64 items-center justify-center text-gray-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
        </div>
      ) : coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-card-bg)] p-8">
          <Ticket size={48} className="text-gray-500 mb-4 animate-pulse" />
          <p className="text-gray-400 text-lg font-semibold">No coupons created yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-5 py-2.5 text-xs font-bold bg-[var(--color-primary)] text-black rounded-xl hover:opacity-90"
          >
            Create First Coupon
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-md">
          <table className="w-full border-collapse text-left text-sm text-white">
            <thead className="bg-neutral-900 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4">Promo Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Minimum Order</th>
                <th className="px-6 py-4">Usage Limit</th>
                <th className="px-6 py-4">Expiry Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {coupons.map((c) => {
                const isExpired = dayjs(c.expiryDate).isBefore(dayjs());
                return (
                  <tr key={c._id} className="hover:bg-neutral-900/40 transition">
                    <td className="px-6 py-4 font-mono font-bold text-base text-[var(--color-primary)]">
                      {c.code}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {c.discountType === "percentage" ? (
                          <Percent size={14} className="text-gray-400" />
                        ) : (
                          <Landmark size={14} className="text-gray-400" />
                        )}
                        <span className="font-semibold">
                          {c.discountType === "percentage" ? `${c.discountValue}% Off` : `${c.discountValue} PKR Off`}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-200">
                      {c.minOrderAmount} PKR
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {c.usedCount} / <span className="text-gray-500 font-semibold">{c.usageLimit}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar size={13} className="text-gray-400" />
                        <span className={isExpired ? "text-red-400 line-through" : ""}>
                          {dayjs(c.expiryDate).format("MMM DD, YYYY")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {c.active && !isExpired ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/20 border border-emerald-800 text-emerald-400">
                          <Check size={10} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950/20 border border-red-850 text-red-400">
                          <X size={10} /> {isExpired ? "Expired" : "Inactive"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="p-2 hover:bg-red-950/20 rounded-lg text-red-500 hover:text-red-400 border border-transparent hover:border-red-900/30 transition cursor-pointer"
                          title="Delete Coupon"
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
      )}
    </div>
  );
};

export default AdminCoupons;
