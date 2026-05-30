import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Inbox, Check, X, RefreshCw, FileText, Loader2 } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

const AdminBookRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/requests");
      if (res.data.success) {
        setRequests(res.data.data || []);
      } else {
        toast.error("Failed to load requests.");
      }
    } catch (error) {
      console.error("Fetch requests error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch book requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const res = await axiosInstance.put(`/requests/${id}`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Request ${newStatus.toLowerCase()} successfully!`);
        // Update local state
        setRequests((prev) =>
          prev.map((req) => (req._id === id ? { ...req, status: newStatus } : req))
        );
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Update request error:", error);
      toast.error(error.response?.data?.message || "Failed to update request status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[var(--color-bg)] text-white pb-12">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">Book Requests</h1>
          <p className="text-sm text-gray-400 mt-2">Manage custom book requests submitted by users</p>
        </div>

        <button
          onClick={fetchRequests}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-neutral-900 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] px-4 py-2.5 text-xs font-bold transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* REQUESTS LIST */}
      <div className="overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-md">
        <table className="w-full border-collapse text-left text-sm text-white">
          <thead className="bg-neutral-900 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] border-b border-[var(--color-border)]">
            <tr>
              <th className="px-6 py-4">Book Details</th>
              <th className="px-6 py-4">Requester Info</th>
              <th className="px-6 py-4">Date Requested</th>
              <th className="px-6 py-4">Notes</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-850">
            {requests.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-500 font-medium">
                  No book requests submitted yet.
                </td>
              </tr>
            ) : (
              requests.map((req) => {
                const dateStr = new Date(req.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <tr key={req._id} className="hover:bg-neutral-900/40 transition">
                    {/* Book Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-neutral-850 flex items-center justify-center rounded-lg text-[var(--color-primary)] border border-neutral-750">
                          <Inbox size={18} />
                        </div>
                        <div>
                          <span className="font-bold text-gray-150 text-sm block">{req.title}</span>
                          <span className="text-xs text-gray-400 block">by {req.author}</span>
                        </div>
                      </div>
                    </td>

                    {/* Requester Info */}
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-200 block">{req.name}</span>
                      <span className="text-xs text-gray-400 block">{req.email}</span>
                      {req.phone && <span className="text-xs text-gray-500 block">{req.phone}</span>}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs text-gray-300 font-semibold">
                      {dateStr}
                    </td>

                    {/* Notes */}
                    <td className="px-6 py-4 max-w-xs">
                      {req.notes ? (
                        <div className="text-xs text-gray-400 leading-relaxed max-h-16 overflow-y-auto custom-scrollbar">
                          {req.notes}
                        </div>
                      ) : (
                        <span className="text-gray-600 italic text-xs">No notes</span>
                      )}
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${
                          req.status === "Approved"
                            ? "bg-emerald-950/20 border-emerald-800 text-emerald-400"
                            : req.status === "Rejected"
                            ? "bg-red-950/20 border-red-850 text-red-400"
                            : "bg-amber-950/20 border-amber-800 text-amber-400"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {updatingId === req._id ? (
                          <Loader2 size={16} className="animate-spin text-gray-400" />
                        ) : (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(req._id, "Approved")}
                              disabled={req.status === "Approved"}
                              className={`p-2 rounded-lg border border-transparent transition cursor-pointer ${
                                req.status === "Approved"
                                  ? "text-gray-600 cursor-not-allowed"
                                  : "hover:bg-emerald-950/20 text-gray-400 hover:text-emerald-400 hover:border-emerald-900/30"
                              }`}
                              title="Approve Request"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(req._id, "Rejected")}
                              disabled={req.status === "Rejected"}
                              className={`p-2 rounded-lg border border-transparent transition cursor-pointer ${
                                req.status === "Rejected"
                                  ? "text-gray-600 cursor-not-allowed"
                                  : "hover:bg-red-950/20 text-gray-400 hover:text-red-400 hover:border-red-900/30"
                              }`}
                              title="Reject Request"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookRequests;
