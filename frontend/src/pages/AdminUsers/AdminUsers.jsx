import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, blockUserAction, unblockUserAction } from "../../store/slices/userSlice";
import { fetchAllOrders } from "../../store/slices/orderSlice";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import {
  User,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Loader2,
  Search,
  Mail,
  Download,
  Filter,
  DollarSign,
  AlertCircle,
  RefreshCcw,
  BookOpen,
  UserCheck
} from "lucide-react";

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  const { orders } = useSelector((state) => state.orders);

  // Lists for dropdowns
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [spendLimit, setSpendLimit] = useState(3000);
  const [inactivityFilter, setInactivityFilter] = useState("all"); // 'all', 'inactive', 'active'
  const [orderStageFilter, setOrderStageFilter] = useState("all"); // 'all', or specific stage

  // Modal / Compose Email States
  const [selectedUser, setSelectedUser] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(null);
  
  // Bulk Email Compose States
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // Fetch Meta-data (Categories, Authors) on mount
  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllOrders());

    const fetchMeta = async () => {
      try {
        const [catRes, authRes] = await Promise.all([
          axiosInstance.get("/categories"),
          axiosInstance.get("/authors")
        ]);
        setCategories(catRes.data || []);
        setAuthors(authRes.data || []);
      } catch (err) {
        console.error("Failed to load categories/authors", err);
      }
    };
    fetchMeta();
  }, [dispatch]);

  const handleToggleBlock = async (userId, currentlyBlocked) => {
    const confirmAction = window.confirm(
      currentlyBlocked
        ? "Are you sure you want to unblock this user?"
        : "Are you sure you want to block this user?"
    );
    if (!confirmAction) return;

    try {
      setToggleLoading(userId);
      if (currentlyBlocked) {
        await dispatch(unblockUserAction(userId)).unwrap();
        toast.success("User account unblocked");
      } else {
        await dispatch(blockUserAction(userId)).unwrap();
        toast.success("User account blocked");
      }
      dispatch(fetchAllUsers());
    } catch (error) {
      toast.error(error.message || "Action failed");
    } finally {
      setToggleLoading(null);
    }
  };

  // User details aggregation
  const getUserAnalytics = (userId) => {
    const userOrders = orders.filter((o) => o.user?._id === userId || o.user === userId);
    
    // Total Spent: sum of totalPrice for non-cancelled orders
    const nonCancelled = userOrders.filter((o) => o.orderStatus !== "Cancelled");
    const totalSpent = nonCancelled.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    // Book categories purchased
    const purchasedCategories = new Set();
    const purchasedAuthors = new Set();
    const orderStages = [];

    userOrders.forEach((o) => {
      if (o.orderStatus) {
        orderStages.push(o.orderStatus);
      }
    });

    nonCancelled.forEach((o) => {
      (o.orderItems || []).forEach((item) => {
        if (item.book) {
          if (item.book.category) {
            const catId = item.book.category._id ? item.book.category._id.toString() : item.book.category.toString();
            purchasedCategories.add(catId);
          }
          if (item.book.author) {
            const authId = item.book.author._id ? item.book.author._id.toString() : item.book.author.toString();
            purchasedAuthors.add(authId);
          }
        }
      });
    });

    return {
      ordersCount: userOrders.length,
      spent: totalSpent,
      purchasedCategories: Array.from(purchasedCategories),
      purchasedAuthors: Array.from(purchasedAuthors),
      orderStages,
      ordersList: userOrders
    };
  };

  // Filter Logic
  const filteredUsers = users.filter((u) => {
    const analytics = getUserAnalytics(u._id);

    // 1. Text Search (name/email)
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Spent Limit Filter
    if (spendLimit && analytics.spent < Number(spendLimit)) {
      return false;
    }

    // 3. Category Filter
    if (selectedCategory) {
      const matchCat = analytics.purchasedCategories.includes(selectedCategory);
      if (!matchCat) return false;
    }

    // 4. Author Filter
    if (selectedAuthor) {
      const matchAuth = analytics.purchasedAuthors.includes(selectedAuthor);
      if (!matchAuth) return false;
    }

    // 5. Inactivity Filter
    if (inactivityFilter === "inactive" && !u.isInactive) return false;
    if (inactivityFilter === "active" && u.isInactive) return false;

    // 6. Active Order Stage Filter
    if (orderStageFilter !== "all") {
      const hasStage = analytics.orderStages.includes(orderStageFilter);
      if (!hasStage) return false;
    }

    return true;
  });

  // Dynamic CSV Download
  const downloadFilteredCSV = () => {
    if (filteredUsers.length === 0) {
      toast.error("No users match the current filter criteria to download!");
      return;
    }

    let csvContent = "\uFEFF"; // UTF-8 BOM
    csvContent += "Name,Email,Phone,Status,Total Orders,Total Spent (Rs.),Last Active\n";

    filteredUsers.forEach((u) => {
      const analytics = getUserAnalytics(u._id);
      const statusText = u.isBlocked ? "Blocked" : u.isInactive ? "Inactive" : "Active";
      const lastActive = u.lastActiveAt ? new Date(u.lastActiveAt).toLocaleDateString() : "N/A";
      csvContent += `"${u.name}","${u.email}","${u.phone || 'N/A'}","${statusText}",${analytics.ordersCount},${analytics.spent},"${lastActive}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `filtered_users_sheet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Successfully downloaded registry sheet for ${filteredUsers.length} users!`);
  };

  // Send Bulk Email to currently filtered list
  const handleSendBulkEmail = async (e) => {
    e.preventDefault();
    if (filteredUsers.length === 0) {
      toast.error("No recipient users inside the current filtered listing!");
      return;
    }
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error("Please enter email Subject and Message body contents!");
      return;
    }

    const confirmSend = window.confirm(
      `Are you sure you want to send this styled email to all ${filteredUsers.length} currently filtered users?`
    );
    if (!confirmSend) return;

    try {
      setSendingEmail(true);
      const recipientEmails = filteredUsers.map((u) => u.email);

      const res = await axiosInstance.post("/users/send-bulk-email", {
        emails: recipientEmails,
        subject: emailSubject,
        body: emailBody
      });

      if (res.data.success) {
        toast.success(`Emails successfully broadcasted to ${filteredUsers.length} customers!`);
        setEmailSubject("");
        setEmailBody("");
      } else {
        toast.error("Failed to broadcast bulk emails.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Bulk emailing session failed.");
      console.error(err);
    } finally {
      setSendingEmail(false);
    }
  };

  const getGeneralStats = () => {
    let activeCount = 0;
    let blockedCount = 0;
    let inactiveCount = 0;

    users.forEach((u) => {
      if (u.isBlocked) blockedCount++;
      else if (u.isInactive) inactiveCount++;
      else activeCount++;
    });

    return { activeCount, blockedCount, inactiveCount };
  };

  const genStats = getGeneralStats();

  if (loading && users.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-400">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[var(--color-bg)] text-white pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">User Management Panel</h1>
          <p className="text-sm text-gray-400 mt-2">Filter customer registers, export sheets, and compose styled bulk emails</p>
        </div>
        <button
          onClick={downloadFilteredCSV}
          className="flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] text-black font-black px-6 py-3.5 text-xs transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_2px_15px_rgba(212,175,55,0.2)]"
        >
          <Download size={16} /> Download Filtered Registry Sheet
        </button>
      </div>

      {/* METRIC BADGES */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 shadow">
          <span className="text-[10px] text-gray-450 block font-semibold uppercase">Total Registered</span>
          <span className="text-2xl font-black text-white">{users.length} Users</span>
        </div>
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 shadow">
          <span className="text-[10px] text-gray-450 block font-semibold uppercase text-emerald-400">Active Users</span>
          <span className="text-2xl font-black text-emerald-450">{genStats.activeCount}</span>
        </div>
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 shadow">
          <span className="text-[10px] text-gray-450 block font-semibold uppercase text-yellow-500">Inactive Accounts</span>
          <span className="text-2xl font-black text-yellow-500">{genStats.inactiveCount}</span>
        </div>
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-5 shadow">
          <span className="text-[10px] text-gray-450 block font-semibold uppercase text-red-500">Blocked Accounts</span>
          <span className="text-2xl font-black text-red-500">{genStats.blockedCount}</span>
        </div>
      </div>

      {/* FILTER CONTROL CRM PANEL */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-xl">
        <h3 className="font-bold text-base text-[var(--color-primary)] flex items-center gap-2">
          <Filter size={16} /> Advanced Filter CRM Controls
        </h3>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 text-xs text-white">
          {/* SEARCH TERM */}
          <div className="space-y-1">
            <label className="text-gray-400 font-semibold block">Customer Details</label>
            <div className="flex items-center bg-neutral-900 border border-[var(--color-border)] rounded-xl focus-within:border-[var(--color-primary)] transition-all">
              <input
                type="text"
                placeholder="Search name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent pl-3.5 pr-2 py-3 outline-none text-white text-xs placeholder-gray-500"
              />
              <div className="pr-2 flex items-center">
                <div className="bg-[var(--color-primary)] p-1.5 rounded-lg flex items-center justify-center">
                  <Search size={12} style={{ color: "#000" }} />
                </div>
              </div>
            </div>
          </div>

          {/* CATEGORY WISE */}
          <div className="space-y-1">
            <label className="text-gray-400 font-semibold block">Category Purchased</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-2.5 py-3 outline-none text-white focus:border-[var(--color-primary)] cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* AUTHOR WISE */}
          <div className="space-y-1">
            <label className="text-gray-400 font-semibold block">Author Purchased</label>
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-2.5 py-3 outline-none text-white focus:border-[var(--color-primary)] cursor-pointer"
            >
              <option value="">All Authors</option>
              {authors.map((auth) => (
                <option key={auth._id} value={auth._id}>{auth.name}</option>
              ))}
            </select>
          </div>

          {/* SPENT LIMIT */}
          <div className="space-y-1">
            <label className="text-gray-400 font-semibold block">Total Spent Limit (Rs.)</label>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="number"
                placeholder="Limit e.g. 3000"
                value={spendLimit}
                onChange={(e) => setSpendLimit(e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl pl-8 pr-2.5 py-3 outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>

          {/* INACTIVE FILTER */}
          <div className="space-y-1">
            <label className="text-gray-400 font-semibold block">User Activity</label>
            <select
              value={inactivityFilter}
              onChange={(e) => setInactivityFilter(e.target.value)}
              className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-2.5 py-3 outline-none text-white focus:border-[var(--color-primary)] cursor-pointer"
            >
              <option value="all">All Registry Status</option>
              <option value="active">Active Accounts Only</option>
              <option value="inactive">Inactive Accounts Only</option>
            </select>
          </div>

          {/* ACTIVE ORDER STAGE FILTER */}
          <div className="space-y-1">
            <label className="text-gray-400 font-semibold block">Order Stage</label>
            <select
              value={orderStageFilter}
              onChange={(e) => setOrderStageFilter(e.target.value)}
              className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-2.5 py-3 outline-none text-white focus:border-[var(--color-primary)] cursor-pointer"
            >
              <option value="all">All Order Stages</option>
              <option value="Pending Payment Verification">Pending Payment Verification</option>
              <option value="Approved">Approved</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* CLEAR FILTER ACTIONS */}
        <div className="flex justify-between items-center text-xs text-gray-400 pt-2">
          <span>Found <strong>{filteredUsers.length} matching users</strong> in catalog database registry listing.</span>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("");
              setSelectedAuthor("");
              setSpendLimit(3000);
              setInactivityFilter("all");
              setOrderStageFilter("all");
              toast.success("CRM filters successfully cleared!");
            }}
            className="flex items-center gap-1 hover:text-[var(--color-primary)] transition cursor-pointer font-bold"
          >
            <RefreshCcw size={12} /> Clear CRM Filters
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* USERS TABLE */}
        <div className="lg:col-span-2 overflow-x-auto rounded-3xl border border-[var(--color-border)] bg-[var(--color-card-bg)] shadow-md h-fit">
          <table className="w-full border-collapse text-left text-sm text-white">
            <thead className="bg-neutral-900 text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Spent (Rs.)</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-550">
                    No registry accounts found matching the specified filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const uStats = getUserAnalytics(u._id);
                  const isBlocked = u.isBlocked === true;

                  return (
                    <tr key={u._id} className="hover:bg-neutral-900/40 transition">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="h-9 w-9 bg-neutral-850 flex items-center justify-center rounded-full text-[var(--color-primary)] border border-neutral-750 font-bold text-xs uppercase">
                          {u.name?.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-gray-150 text-sm block">{u.name}</span>
                          <span className="text-[10px] text-gray-500 block">{u.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-gray-300">
                        {u.phone || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                          isBlocked
                            ? "bg-red-950/20 text-red-400 border border-red-900"
                            : u.isInactive
                            ? "bg-yellow-950/20 text-yellow-450 border border-yellow-850"
                            : "bg-emerald-950/20 text-emerald-400 border border-emerald-900"
                        }`}>
                          {isBlocked ? "Blocked" : u.isInactive ? "Inactive" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[var(--color-primary)]">
                        Rs. {uStats.spent}
                        <span className="block text-[9px] text-gray-500 font-semibold uppercase">{uStats.ordersCount} orders</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="p-2 hover:bg-neutral-800 rounded-lg text-[var(--color-primary)] border border-transparent hover:border-neutral-750 transition cursor-pointer"
                            title="View Purchase History"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() => handleToggleBlock(u._id, isBlocked)}
                            disabled={toggleLoading === u._id}
                            className={`px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                              isBlocked
                                ? "bg-emerald-950/20 text-emerald-400 border-emerald-900 hover:bg-emerald-900"
                                : "bg-red-950/20 text-red-400 border-red-900 hover:bg-red-950"
                            }`}
                          >
                            {toggleLoading === u._id ? (
                              "..."
                            ) : isBlocked ? (
                              <>
                                <ShieldCheck size={10} /> Unblock
                              </>
                            ) : (
                              <>
                                <ShieldAlert size={10} /> Block
                              </>
                            )}
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

        {/* COMPOSE EMAIL WRITER PANEL */}
        <div className="lg:col-span-1 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 shadow-xl h-fit space-y-5">
          <div className="border-b border-neutral-900 pb-3 flex items-center gap-2">
            <Mail size={18} className="text-[var(--color-primary)]" />
            <div>
              <h3 className="font-extrabold text-base text-white">Branded Email Composer</h3>
              <p className="text-[10px] text-gray-500">Send custom themed updates to filtered lists</p>
            </div>
          </div>

          <form onSubmit={handleSendBulkEmail} className="space-y-4 text-xs">
            {/* Filter Count Alert */}
            <div className="flex gap-2.5 items-start p-3 bg-neutral-950/50 border border-neutral-900 rounded-2xl text-[11px] text-gray-300">
              <AlertCircle size={16} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Email Broadcast Target</span>
                Currently targeting <strong className="text-[var(--color-primary)]">{filteredUsers.length} users</strong> inside the active filter parameters.
              </div>
            </div>

            {/* SUBJECT */}
            <div className="space-y-1">
              <label className="text-gray-400 font-bold">Email Subject Line *</label>
              <input
                type="text"
                required
                placeholder="e.g. Special Discount Just For You!"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none text-white focus:border-[var(--color-primary)]"
              />
            </div>

            {/* MESSAGE BODY */}
            <div className="space-y-1">
              <label className="text-gray-400 font-bold">Email Message / Body *</label>
              <textarea
                required
                rows={8}
                placeholder="Write your email announcement or newsletter content here..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full bg-neutral-900 border border-[var(--color-border)] rounded-xl px-4 py-3 outline-none text-white focus:border-[var(--color-primary)] resize-none"
              />
            </div>

            {/* SEND BUTTON */}
            <button
              type="submit"
              disabled={sendingEmail || filteredUsers.length === 0}
              className="w-full py-3.5 bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-40 text-black font-extrabold rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 text-xs shadow-md"
            >
              {sendingEmail ? (
                <>
                  <Loader2 className="animate-spin" size={14} /> Broadcasting Emails...
                </>
              ) : (
                <>
                  <Mail size={14} /> Send Styled Branded Email
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* PURCHASE HISTORY DRAWER/MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5 animate-fadeIn">
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 w-full max-w-2xl text-white relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
              <div className="flex items-center gap-2">
                <UserCheck size={18} className="text-[var(--color-primary)]" />
                <h3 className="font-extrabold text-lg text-[var(--color-primary)]">
                  {selectedUser.name}&apos;s CRM History
                </h3>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-xs px-3.5 py-2 bg-neutral-900 border border-[var(--color-border)] rounded-xl hover:border-red-500 transition cursor-pointer font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2 p-4 bg-neutral-950/40 border border-neutral-900 rounded-2xl">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">User Details</span>
                  <span className="font-bold text-gray-250 text-sm">{selectedUser.name}</span>
                  <span className="block text-gray-400">{selectedUser.email}</span>
                  <span className="block text-gray-450">{selectedUser.phone || "No Phone"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block font-semibold">Account Metrics</span>
                  <span className="font-bold text-gray-250 block">Spent: Rs. {getUserAnalytics(selectedUser._id).spent}</span>
                  <span className="text-gray-400 block">Orders: {getUserAnalytics(selectedUser._id).ordersCount}</span>
                  <span className="text-gray-400 block">Last Active: {selectedUser.lastActiveAt ? new Date(selectedUser.lastActiveAt).toLocaleString() : "N/A"}</span>
                </div>
              </div>

              <h4 className="font-bold text-sm text-[var(--color-primary)] uppercase tracking-wider mt-6">Order Catalog Invoices</h4>
              {getUserAnalytics(selectedUser._id).ordersList.length === 0 ? (
                <p className="text-gray-500 text-center py-6">This customer has not placed any orders yet.</p>
              ) : (
                getUserAnalytics(selectedUser._id).ordersList.map((order) => (
                  <div key={order._id} className="bg-neutral-950/40 border border-neutral-900 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between font-bold text-gray-300">
                      <span>Invoice: {order.orderNumber || order._id}</span>
                      <span className="text-[var(--color-primary)]">Rs. {order.totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Placed On: {new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="font-bold">Status: {order.orderStatus} ({order.paymentMethod})</span>
                    </div>
                    <div className="border-t border-neutral-900 pt-2 text-[11px] text-gray-400 space-y-1">
                      {(order.orderItems || []).map((item, idx) => (
                        <p key={idx} className="flex justify-between">
                          <span>&bull; {item.title} x {item.quantity}</span>
                          <span className="font-semibold text-gray-300">Rs. {item.price * item.quantity}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
