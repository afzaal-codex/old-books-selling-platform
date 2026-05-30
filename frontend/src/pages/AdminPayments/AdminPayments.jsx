import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments, verifyPaymentAction } from "../../store/slices/paymentSlice";
import { fetchAdminStats } from "../../store/slices/orderSlice";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CreditCard, Eye, Check, X, ShieldAlert, Loader2, Sparkles } from "lucide-react";

const AdminPayments = () => {
  const dispatch = useDispatch();
  const { payments, loading } = useSelector((state) => state.payments);
  const { adminStats } = useSelector((state) => state.orders);
  const [searchParams] = useSearchParams();

  // States
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPayments = payments.filter((p) => {
    const matchesMethod = methodFilter === "all" || p.paymentMethod === methodFilter;
    const matchesStatus = statusFilter === "all" || p.verificationStatus === statusFilter;
    return matchesMethod && matchesStatus;
  });

  useEffect(() => {
    dispatch(fetchPayments());
    dispatch(fetchAdminStats());
  }, [dispatch]);

  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam) {
      setStatusFilter(statusParam);
    }
  }, [searchParams]);

  const handleVerify = async (paymentId, status) => {
    try {
      setActionLoading(true);
      await dispatch(
        verifyPaymentAction({ id: paymentId, verificationStatus: status, adminNotes })
      ).unwrap();
      toast.success(`Payment ${status.toLowerCase()} successfully!`);
      setSelectedPayment(null);
      setAdminNotes("");
      dispatch(fetchPayments());
    } catch (error) {
      toast.error(error.message || "Failed to verify payment");
    } finally {
      setActionLoading(false);
    }
  };

  // Compute account-wise metrics
  const getAccountSummaries = () => {
    let jazzcashTotal = 0;
    let easypaisaTotal = 0;
    let bankTotal = 0;

    payments.forEach((p) => {
      if (p.verificationStatus === "Approved" && p.order) {
        const amt = p.order.totalPrice || 0;
        if (p.paymentMethod === "JazzCash") jazzcashTotal += amt;
        if (p.paymentMethod === "EasyPaisa") easypaisaTotal += amt;
        if (p.paymentMethod === "Bank Transfer") bankTotal += amt;
      }
    });

    return { jazzcashTotal, easypaisaTotal, bankTotal };
  };

  const accountStats = getAccountSummaries();

  if (loading && payments.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-400">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[var(--color-bg)] text-white pb-12">
      {/* HEADER */}
      <div className="border-b border-[var(--color-border)] pb-5">
        <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">Payments Verification Monitoring</h1>
        <p className="text-sm text-gray-400 mt-2">Approve/reject online payment receipts and monitor channel revenues</p>
      </div>

      {/* ACCOUNT SUMMARIES ROW */}
      <div className="grid gap-6 md:grid-cols-5">
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 shadow-md">
          <span className="text-[10px] text-gray-400 font-semibold block uppercase">Total Store Revenue</span>
          <span className="text-2xl font-black text-white block mt-1">{adminStats?.totalRevenue || 0} PKR</span>
          <span className="text-[10px] text-emerald-450 block">All orders (excl. Cancelled)</span>
        </div>

        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 shadow-md">
          <span className="text-[10px] text-gray-400 font-semibold block uppercase">Pending Verification</span>
          <span className="text-2xl font-black text-[var(--color-accent)] block mt-1">{adminStats?.pendingVerification || 0}</span>
          <span className="text-[10px] text-red-400 block">Needs transaction approval</span>
        </div>

        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 shadow-md">
          <span className="text-[10px] text-gray-400 font-semibold block uppercase">JazzCash Approved</span>
          <span className="text-2xl font-black text-[var(--color-primary)] block mt-1">{accountStats.jazzcashTotal} PKR</span>
          <span className="text-[10px] text-gray-500 block">Verified mobile wallet</span>
        </div>

        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 shadow-md">
          <span className="text-[10px] text-gray-400 font-semibold block uppercase">EasyPaisa Approved</span>
          <span className="text-2xl font-black text-[var(--color-primary)] block mt-1">{accountStats.easypaisaTotal} PKR</span>
          <span className="text-[10px] text-gray-500 block">Verified mobile wallet</span>
        </div>

        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 shadow-md">
          <span className="text-[10px] text-gray-400 font-semibold block uppercase">Bank Approved</span>
          <span className="text-2xl font-black text-[var(--color-primary)] block mt-1">{accountStats.bankTotal} PKR</span>
          <span className="text-[10px] text-gray-500 block">Verified bank wire</span>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 text-xs bg-[var(--color-card-bg)] border border-[var(--color-border)] p-4 rounded-xl">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase">Payment Method</label>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-neutral-900 border border-[var(--color-border)] rounded-xl px-3 py-2 outline-none text-white focus:border-[var(--color-primary)] cursor-pointer"
          >
            <option value="all">All Methods</option>
            <option value="JazzCash">JazzCash</option>
            <option value="EasyPaisa">EasyPaisa</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-gray-500 font-bold uppercase">Verification Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-900 border border-[var(--color-border)] rounded-xl px-3 py-2 outline-none text-white focus:border-[var(--color-primary)] cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* PAYMENTS LIST */}
      <div className="overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-md">
        <table className="w-full border-collapse text-left text-sm text-white">
          <thead className="bg-neutral-900 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] border-b border-[var(--color-border)]">
            <tr>
              <th className="px-6 py-4">Transaction ID & Date</th>
              <th className="px-6 py-4">Linked Order</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Payment Method</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Verification status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-850">
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                  No online payment submissions found.
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => {
                return (
                  <tr key={p._id} className="hover:bg-neutral-900/40 transition">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-extrabold text-[var(--color-primary)] block uppercase">{p.transactionId}</span>
                      <span className="text-[10px] text-gray-500 block mt-0.5">{new Date(p.createdAt).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-gray-300">
                      {p.order?._id || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="font-semibold block text-gray-200">{p.order?.user?.name || "Deleted User"}</span>
                      <span className="text-gray-500 block">{p.order?.user?.email}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-xs">
                      {p.paymentMethod}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-200">
                      {p.order?.totalPrice || 0} PKR
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        p.verificationStatus === "Approved"
                          ? "bg-emerald-950/20 text-emerald-400 border border-emerald-900"
                          : p.verificationStatus === "Rejected"
                          ? "bg-red-950/20 text-red-400 border border-red-900"
                          : "bg-yellow-950/20 text-yellow-450 border border-yellow-850"
                      }`}>
                        {p.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-[var(--color-primary)] border border-transparent hover:border-neutral-750 transition cursor-pointer"
                        title="Verify Receipt Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* VERIFY DETAIL OVERLAY MODAL */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5 animate-fadeIn">
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 w-full max-w-3xl text-white relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
              <h3 className="font-extrabold text-lg text-[var(--color-primary)]">Verify Receipt Details</h3>
              <button
                onClick={() => {
                  setSelectedPayment(null);
                  setAdminNotes("");
                }}
                className="text-xs px-3 py-1.5 bg-neutral-900 border border-[var(--color-border)] rounded-xl hover:border-red-500 transition cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Screenshot or fallback */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Proof Receipt</h4>
                {selectedPayment.screenshot ? (
                  <div className="border border-[var(--color-border)] rounded-2xl overflow-hidden p-2 bg-neutral-950 max-h-[300px] flex items-center justify-center">
                    <img
                      src={selectedPayment.screenshot}
                      alt="receipt-screenshot"
                      className="max-h-[280px] object-contain rounded"
                    />
                  </div>
                ) : (
                  <div className="h-[220px] rounded-2xl bg-neutral-900 flex flex-col items-center justify-center border border-dashed border-neutral-700 text-gray-500 text-xs">
                    <ShieldAlert size={36} className="mb-2" />
                    <span>No receipt screenshot uploaded</span>
                  </div>
                )}
              </div>

              {/* Data overview & verification fields */}
              <div className="space-y-4 text-xs text-gray-300">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Metadata Parameters</h4>
                <p><span className="text-gray-500">Transaction TID:</span> <strong className="text-[var(--color-primary)] uppercase">{selectedPayment.transactionId}</strong></p>
                <p><span className="text-gray-500">Method Channel:</span> {selectedPayment.paymentMethod}</p>
                <p><span className="text-gray-500">Linked Order ID:</span> {selectedPayment.order?._id}</p>
                <p><span className="text-gray-500">Total Price:</span> {selectedPayment.order?.totalPrice || 0} PKR</p>
                <p><span className="text-gray-500">Customer Name:</span> {selectedPayment.order?.user?.name}</p>
                <p><span className="text-gray-500">Customer Phone:</span> {selectedPayment.order?.user?.phone || "Not provided"}</p>

                {/* Status indicator */}
                <p>
                  <span className="text-gray-500">Status:</span>{" "}
                  <strong className="text-white uppercase">{selectedPayment.verificationStatus}</strong>
                </p>

                {/* Input admin notes */}
                {selectedPayment.verificationStatus === "Pending" && (
                  <div className="space-y-2 pt-2">
                    <label className="text-gray-400">Admin Notes / Reason</label>
                    <textarea
                      rows={2}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes for the customer (optional)..."
                      className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-3 py-2 outline-none focus:border-[var(--color-primary)] resize-none"
                    />
                  </div>
                )}

                {/* Actions */}
                {selectedPayment.verificationStatus === "Pending" && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleVerify(selectedPayment._id, "Approved")}
                      disabled={actionLoading}
                      className="flex-1 py-3 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-600 transition flex items-center justify-center gap-1.5 cursor-pointer text-xs disabled:opacity-50"
                    >
                      <Check size={14} /> Approve Payment
                    </button>
                    <button
                      onClick={() => handleVerify(selectedPayment._id, "Rejected")}
                      disabled={actionLoading}
                      className="flex-1 py-3 rounded-xl bg-[var(--color-accent)] text-white font-bold hover:opacity-90 transition flex items-center justify-center gap-1.5 cursor-pointer text-xs disabled:opacity-50"
                    >
                      <X size={14} /> Reject Payment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
