import { useState } from "react";
import toast from "react-hot-toast";
import { Lock, Mail } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import ButtonLoader from "../../components/loaders/ButtonLoader";

const AdminSecurity = () => {
  // Password form state
  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    otp: "",
    matchNumber: "",
  });
  const [pwdLoading, setPwdLoading] = useState(false);

  // Email form state
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    confirmEmail: "",
    otp: "",
    matchNumber: "",
  });
  const [emailLoading, setEmailLoading] = useState(false);

  const requestPwdOtp = async () => {
    try {
      const response = await axiosInstance.post("/cms/request-otp", { purpose: "admin-password" });
      setPwdForm((prev) => ({ ...prev, matchNumber: response.data.matchNumber || "" }));
      toast.success("OTP request sent to admin email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const requestEmailOtp = async () => {
    try {
      const response = await axiosInstance.post("/cms/request-otp", { purpose: "cms-update" });
      setEmailForm((prev) => ({ ...prev, matchNumber: response.data.matchNumber || "" }));
      toast.success("OTP request sent to admin email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handlePwdSubmit = async (e) => {
    e.preventDefault();
    try {
      setPwdLoading(true);
      const response = await axiosInstance.put("/cms/admin-password", {
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
        confirmPassword: pwdForm.confirmPassword,
        otp: pwdForm.otp
      });
      toast.success(response.data.message || "Password changed successfully");
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "", otp: "", matchNumber: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setPwdLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      setEmailLoading(true);
      const response = await axiosInstance.put("/cms/admin-email", {
        newEmail: emailForm.newEmail,
        confirmEmail: emailForm.confirmEmail,
        otp: emailForm.otp
      });
      toast.success(response.data.message || "Admin email changed successfully. Please log in again using your new email.");
      setEmailForm({ newEmail: "", confirmEmail: "", otp: "", matchNumber: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change email");
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="space-y-8 bg-[var(--color-bg)] text-white pb-12">
      {/* HEADER */}
      <div className="border-b border-[var(--color-border)] pb-5">
        <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">Admin Security Configurations</h1>
        <p className="text-sm text-gray-400 mt-2">Update administrative login credentials (email and password) after security matching verification</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* PASSWORD FORM */}
        <form onSubmit={handlePwdSubmit} className="space-y-6">
          <div className="bg-[#111114] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md">
            <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3 flex items-center gap-2">
              <Lock size={18} className="text-[var(--color-primary)]" />
              Change Admin Password
            </h3>

            <div className="space-y-4 text-sm">
              <div className="space-y-2">
                <label className="text-gray-350 font-semibold block">Current Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={pwdForm.currentPassword}
                  onChange={(e) => setPwdForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={pwdForm.newPassword}
                  onChange={(e) => setPwdForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Confirm new password"
                  value={pwdForm.confirmPassword}
                  onChange={(e) => setPwdForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Verification & Action Bar */}
              <div className="pt-4 border-t border-neutral-900 space-y-4">
                <label className="text-gray-300 font-semibold block">Security Verification</label>
                <div className="flex gap-2">
                  <input
                    placeholder="6 digit OTP"
                    required
                    value={pwdForm.otp}
                    onChange={(e) => setPwdForm((prev) => ({ ...prev, otp: e.target.value }))}
                    className="flex-1 bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  />
                  <button
                    type="button"
                    onClick={requestPwdOtp}
                    className="border border-[var(--color-primary)] text-[var(--color-primary)] font-extrabold px-4 rounded-xl text-xs uppercase tracking-wider"
                  >
                    Send OTP
                  </button>
                </div>

                {pwdForm.matchNumber && (
                  <div className="text-center bg-neutral-900 border border-[var(--color-border)] rounded-xl py-2.5 text-xs text-gray-400">
                    Match Number: <strong className="text-[var(--color-primary)] text-base ml-1">{pwdForm.matchNumber}</strong>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] text-black font-extrabold py-3.5 hover:opacity-90 transition cursor-pointer shadow-lg text-sm disabled:opacity-50"
                >
                  {pwdLoading ? <ButtonLoader label="Updating..." /> : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* EMAIL FORM */}
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div className="bg-[#111114] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-md">
            <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3 flex items-center gap-2">
              <Mail size={18} className="text-[var(--color-primary)]" />
              Change Admin Email
            </h3>

            <div className="space-y-4 text-sm">
              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">New Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm((prev) => ({ ...prev, newEmail: e.target.value }))}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 font-semibold block">Confirm New Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={emailForm.confirmEmail}
                  onChange={(e) => setEmailForm((prev) => ({ ...prev, confirmEmail: e.target.value }))}
                  className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Verification & Action Bar */}
              <div className="pt-4 border-t border-neutral-900 space-y-4">
                <label className="text-gray-300 font-semibold block">Security Verification</label>
                <div className="flex gap-2">
                  <input
                    placeholder="6 digit OTP"
                    required
                    value={emailForm.otp}
                    onChange={(e) => setEmailForm((prev) => ({ ...prev, otp: e.target.value }))}
                    className="flex-1 bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)]"
                  />
                  <button
                    type="button"
                    onClick={requestEmailOtp}
                    className="border border-[var(--color-primary)] text-[var(--color-primary)] font-extrabold px-4 rounded-xl text-xs uppercase tracking-wider"
                  >
                    Send OTP
                  </button>
                </div>

                {emailForm.matchNumber && (
                  <div className="text-center bg-neutral-900 border border-[var(--color-border)] rounded-xl py-2.5 text-xs text-gray-400">
                    Match Number: <strong className="text-[var(--color-primary)] text-base ml-1">{emailForm.matchNumber}</strong>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={emailLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] text-black font-extrabold py-3.5 hover:opacity-90 transition cursor-pointer shadow-lg text-sm disabled:opacity-50"
                >
                  {emailLoading ? <ButtonLoader label="Updating..." /> : "Update Email"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSecurity;
