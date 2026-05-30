import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import PageLoader from "../../components/loaders/PageLoader";
import ButtonLoader from "../../components/loaders/ButtonLoader";
import toast from "react-hot-toast";
import { Download, Mail, Send } from "lucide-react";

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [connectSubmissions, setConnectSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("newsletter");

  // Email form states
  const [targetList, setTargetList] = useState("all");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [newsletterRes, connectRes] = await Promise.all([
        axiosInstance.get("/newsletter"),
        axiosInstance.get("/connect"),
      ]);
      setSubscribers(newsletterRes.data || []);
      setConnectSubmissions(connectRes.data || []);
    } catch (err) {
      console.error("Failed to load subscribers data:", err);
      toast.error("Failed to load subscribers lists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownloadCSV = (data, listName) => {
    if (data.length === 0) {
      toast.error("No data available to export");
      return;
    }
    const headers = ["Email", "Subscribed At"];
    const rows = data.map((sub) => [
      sub.email,
      new Date(sub.createdAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${listName}_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded subscriber sheet successfully!");
  };

  const handleSendCustomEmail = async (e) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error("Subject and message body are required");
      return;
    }

    try {
      setSendingEmail(true);
      const response = await axiosInstance.post("/newsletter/send-custom-email", {
        target: targetList,
        subject: emailSubject,
        body: emailBody,
      });

      toast.success(response.data.message || "Custom emails sent successfully!");
      setEmailSubject("");
      setEmailBody("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send emails");
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) return <PageLoader label="Loading Subscribers..." />;

  const currentList = activeTab === "newsletter" ? subscribers : connectSubmissions;

  return (
    <div className="space-y-8 bg-[var(--color-bg)] text-white pb-12">
      {/* HEADER */}
      <div className="border-b border-[var(--color-border)] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">Newsletter & Connections Manager</h1>
          <p className="text-sm text-gray-400 mt-1">Export list spreadsheets and broadcast announcements to your audience.</p>
        </div>
        <button
          onClick={() => handleDownloadCSV(currentList, activeTab)}
          className="flex items-center gap-2 rounded-xl bg-neutral-900 border border-[var(--color-border)] px-4 py-2.5 hover:bg-neutral-850 hover:text-[var(--color-primary)] transition cursor-pointer text-xs font-bold"
        >
          <Download size={14} />
          Export Current Sheet
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* LIST TABLE COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* TABS */}
          <div className="flex gap-4 border-b border-[var(--color-border)] pb-3 text-xs font-bold uppercase">
            <button
              onClick={() => setActiveTab("newsletter")}
              className={`pb-2 px-1 border-b-2 transition cursor-pointer ${
                activeTab === "newsletter"
                  ? "border-[var(--color-primary)] text-[var(--color-primary)] font-bold"
                  : "border-transparent text-gray-400 hover:text-gray-250"
              }`}
            >
              Newsletter ({subscribers.length})
            </button>
            <button
              onClick={() => setActiveTab("connect")}
              className={`pb-2 px-1 border-b-2 transition cursor-pointer ${
                activeTab === "connect"
                  ? "border-[var(--color-primary)] text-[var(--color-primary)] font-bold"
                  : "border-transparent text-gray-400 hover:text-gray-250"
              }`}
            >
              Connect Submissions ({connectSubmissions.length})
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-black/35 text-gray-400 font-bold uppercase">
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {currentList.map((item) => (
                    <tr key={item._id} className="hover:bg-neutral-950/40 transition">
                      <td className="p-4 font-semibold text-gray-250">{item.email}</td>
                      <td className="p-4 text-gray-500">{new Date(item.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {currentList.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <Mail size={32} className="mx-auto mb-2 text-gray-700" />
                  <p>No subscribers found in this list.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CUSTOM MAILING BROADCAST PANEL */}
        <div className="lg:col-span-1 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 h-fit space-y-6 shadow-md">
          <div>
            <h3 className="font-bold text-lg text-white border-b border-neutral-900 pb-3 flex items-center gap-2">
              <Mail className="text-[var(--color-primary)]" size={18} />
              Broadcast Email
            </h3>
            <p className="text-[10px] text-gray-400 mt-2">Write a custom notification email to broadcast to selected subscribers instantly.</p>
          </div>

          <form onSubmit={handleSendCustomEmail} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold block">Target Audience</label>
              <select
                value={targetList}
                onChange={(e) => setTargetList(e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-3 py-2.5 outline-none text-white focus:border-[var(--color-primary)] cursor-pointer"
              >
                <option value="all">All Combined ({subscribers.length + connectSubmissions.length})</option>
                <option value="newsletter">Newsletter Subscribers Only ({subscribers.length})</option>
                <option value="connect">Connect Form Submissions Only ({connectSubmissions.length})</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold block">Subject Title</label>
              <input
                type="text"
                required
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="e.g. Exclusive Weekend Book Haul & Rare Finds!"
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-3 py-2.5 outline-none text-white focus:border-[var(--color-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-300 font-semibold block">Message Body</label>
              <textarea
                required
                rows={8}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Write your email announcement here..."
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl p-3 outline-none text-white focus:border-[var(--color-primary)]"
              />
            </div>

            <button
              type="submit"
              disabled={sendingEmail}
              className="w-full py-3 bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed text-black font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-xs font-bold"
            >
              {sendingEmail ? (
                <ButtonLoader label="Broadcasting..." />
              ) : (
                <>
                  <Send size={14} /> Send Custom Broadcast
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminNewsletter;
