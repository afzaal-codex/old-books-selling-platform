import { useState } from "react";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import ButtonLoader from "../../components/loaders/ButtonLoader";

const AdminSecurity = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
    matchNumber: "",
  });
  const [loading, setLoading] = useState(false);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const requestOtp = async () => {
    try {
      const response = await axiosInstance.post("/cms/request-otp", { purpose: "admin-password" });
      setField("matchNumber", response.data.matchNumber || "");
      toast.success("OTP request sent to admin email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.put("/cms/admin-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
        otp: form.otp
      });
      toast.success(response.data.message || "Password changed successfully");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "", otp: "", matchNumber: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 bg-[var(--color-bg)] text-white pb-12">
      {/* HEADER */}
      <div className="border-b border-[var(--color-border)] pb-5">
        <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">Admin Security Configurations</h1>
        <p className="text-sm text-gray-400 mt-2">Update administrative password credentials after email matching verification</p>
      </div>

      <form onSubmit={submit} className="space-y-6 max-w-2xl">
        <div className="bg-[#111114] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md">
          <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3 flex items-center gap-2">
            <Lock size={18} className="text-[var(--color-primary)]" />
            Change Admin Password
          </h3>

          <div className="grid gap-6 text-sm">
            <div className="space-y-2">
              <label className="text-gray-300 font-semibold block">Current Password *</label>
              <input
                type="password"
                required
                value={form.currentPassword}
                onChange={(e) => setField("currentPassword", e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-300 font-semibold block">New Password *</label>
              <input
                type="password"
                required
                value={form.newPassword}
                onChange={(e) => setField("newPassword", e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-300 font-semibold block">Confirm New Password *</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setField("confirmPassword", e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>

        {/* SECURITY OTP AUTHORIZATION BAR */}
        <div className="bg-[#111114] border border-[var(--color-border)] rounded-3xl p-6 space-y-4 shadow-md">
          <h4 className="font-bold text-sm text-gray-300">Security Verification</h4>
          
          <div className="grid gap-4 md:grid-cols-[1fr_auto] items-center">
            <div className="grid gap-3 md:grid-cols-3 items-center">
              <input
                placeholder="6 digit OTP"
                required
                value={form.otp}
                onChange={(e) => setField("otp", e.target.value)}
                className="bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3.5 text-white outline-none focus:border-[var(--color-primary)] text-sm"
              />
              
              {form.matchNumber ? (
                <div className="text-center bg-neutral-900 border border-[var(--color-border)] rounded-xl py-3 text-xs text-gray-400">
                  Match Number: <strong className="text-[var(--color-primary)] text-lg ml-1">{form.matchNumber}</strong>
                </div>
              ) : (
                <div className="text-center text-[10px] text-gray-500 bg-neutral-900/20 border border-neutral-900/50 rounded-xl py-3.5">
                  Send OTP to see match no.
                </div>
              )}
              
              <button
                type="button"
                onClick={requestOtp}
                className="rounded-2xl border border-[var(--color-primary)] text-[var(--color-primary)] font-extrabold px-5 py-3.5 hover:opacity-90 transition cursor-pointer text-sm"
              >
                Send OTP
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] text-black font-extrabold px-8 py-4 hover:opacity-90 transition cursor-pointer shadow-lg text-sm disabled:opacity-50"
            >
              {loading ? <ButtonLoader label="Updating..." /> : "Update Password"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSecurity;
