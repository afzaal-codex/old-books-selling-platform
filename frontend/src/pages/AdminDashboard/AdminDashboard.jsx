import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "../../store/slices/orderSlice";
import { fetchSettings } from "../../store/slices/cmsSlice";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { DollarSign, ShoppingCart, Loader2, Package, CheckCircle2, RefreshCcw, BellRing, Settings } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import SeoHead from "../../components/common/SeoHead";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { adminStats, loading } = useSelector((state) => state.orders);
  const [salesTrend, setSalesTrend] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchSettings());
    fetchSalesTrends();
  }, [dispatch]);

  const fetchSalesTrends = async () => {
    try {
      setLoadingChart(true);
      // Fetch orders to compute sales trends dynamically
      const res = await axiosInstance.get("/orders");
      const orders = res.data || [];

      // Group orders by month/date
      const last7Days = Array.from({ length: 7 }).map((_, idx) => {
        const date = new Date();
        date.setDate(date.getDate() - idx);
        return {
          dateStr: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          rawDate: date.toDateString(),
          sales: 0,
          revenue: 0,
        };
      }).reverse();

      orders.forEach((order) => {
        const orderDateStr = new Date(order.createdAt).toDateString();
        const matchingDay = last7Days.find((day) => day.rawDate === orderDateStr);
        if (matchingDay && order.orderStatus !== "Cancelled") {
          matchingDay.sales += order.orderItems.reduce((acc, item) => acc + item.quantity, 0);
          matchingDay.revenue += order.totalPrice;
        }
      });

      setSalesTrend(last7Days);
    } catch (error) {
      console.error("Failed to load chart trends", error);
    } finally {
      setLoadingChart(false);
    }
  };

  if (loading) {
    return (
      <SeoHead page="Admin Dashboard" />
      <div className="flex h-96 items-center justify-center text-gray-400">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
      </div>
    );
  }

  const stats = adminStats || {
    totalRevenue: 0,
    totalOrders: 0,
    pendingVerification: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    codOrders: 0,
    onlineOrders: 0,
    booksCount: 0,
  };

  return (
      <SeoHead page="Admin Dashboard" />
      <div className="space-y-8 bg-[var(--color-bg)] text-white pb-12">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">Admin Control Panel</h1>
          <p className="text-sm text-gray-400 mt-2">Real-time storefront metrics and dashboard stats</p>
        </div>

        <button
          onClick={() => {
            dispatch(fetchAdminStats());
            fetchSalesTrends();
          }}
          className="flex items-center gap-2 rounded-xl bg-neutral-900 border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] px-4 py-2.5 text-xs font-bold transition cursor-pointer"
        >
          <RefreshCcw size={14} /> Refresh Stats
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* REVENUE */}
        <Link to="/admin/payments" className="bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-3xl p-6 flex justify-between items-center shadow-lg transition-all duration-300 hover:translate-y-[-4px]">
          <div className="space-y-2">
            <span className="text-xs text-gray-400 font-semibold block uppercase">Total Revenue</span>
            <span className="text-2xl font-black text-white">{stats.totalRevenue} PKR</span>
            <span className="text-[10px] text-emerald-450 block font-medium">Delivered & verified orders</span>
          </div>
          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-800/50 text-emerald-400">
            <DollarSign size={24} />
          </div>
        </Link>

        {/* ORDERS */}
        <Link to="/admin/orders" className="bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-3xl p-6 flex justify-between items-center shadow-lg transition-all duration-300 hover:translate-y-[-4px]">
          <div className="space-y-2">
            <span className="text-xs text-gray-400 font-semibold block uppercase">Total Orders</span>
            <span className="text-2xl font-black text-white">{stats.totalOrders}</span>
            <span className="text-[10px] text-gray-400 block font-medium">COD: {stats.codOrders} | Online: {stats.onlineOrders}</span>
          </div>
          <div className="bg-[var(--color-primary)]/10 p-4 rounded-2xl border border-[var(--color-primary)]/30 text-[var(--color-primary)]">
            <ShoppingCart size={24} />
          </div>
        </Link>

        {/* PENDING VERIFICATION */}
        <Link to="/admin/payments?status=Pending" className="bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-3xl p-6 flex justify-between items-center shadow-lg transition-all duration-300 hover:translate-y-[-4px]">
          <div className="space-y-2">
            <span className="text-xs text-gray-400 font-semibold block uppercase">Pending Verification</span>
            <span className="text-2xl font-black text-[var(--color-accent)]">{stats.pendingVerification}</span>
            <span className="text-[10px] text-red-400 block font-medium">Needs transaction approval</span>
          </div>
          <div className="bg-[var(--color-accent)]/10 p-4 rounded-2xl border border-[var(--color-accent)]/30 text-[var(--color-accent)]">
            <Loader2 className="animate-spin" size={24} />
          </div>
        </Link>

        {/* BOOKS COUNT */}
        <Link to="/admin/books" className="bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-3xl p-6 flex justify-between items-center shadow-lg transition-all duration-300 hover:translate-y-[-4px]">
          <div className="space-y-2">
            <span className="text-xs text-gray-400 font-semibold block uppercase">Active Catalog</span>
            <span className="text-2xl font-black text-white">{stats.booksCount} Titles</span>
            <span className="text-[10px] text-gray-400 block font-medium">Unique book entries</span>
          </div>
          <div className="bg-blue-950/40 p-4 rounded-2xl border border-blue-800/50 text-blue-400">
            <Package size={24} />
          </div>
        </Link>
      </div>

      {/* SALES PERFORMANCE GRAPH */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-3xl p-6 space-y-6 shadow-lg">
        <div>
          <h3 className="font-bold text-lg text-white">Sales Performance Trends</h3>
          <p className="text-xs text-gray-400 mt-1">Orders placed and revenue generated over the last 7 days</p>
        </div>

        <div className="h-[300px]">
          {loadingChart ? (
            <div className="h-full flex items-center justify-center text-gray-500">Loading graph...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#222" strokeDasharray="3 3" />
                <XAxis dataKey="dateStr" stroke="#888" fontSize={11} />
                <YAxis stroke="#888" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card-bg)",
                    border: "1px solid var(--color-border)",
                    color: "white",
                    borderRadius: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue (PKR)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* QUICK LINK PANELS */}
      <div className="grid gap-6 md:grid-cols-3">
        <Link
          to="/admin/orders"
          className="bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition rounded-3xl p-6 flex flex-col justify-between h-40 shadow-md group"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-gray-100 group-hover:text-[var(--color-primary)] transition">Orders Control</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Update step-by-step order statuses, set shipping numbers, and track deliveries.</p>
          </div>
          <span className="text-xs font-semibold text-[var(--color-primary)] group-hover:underline flex items-center gap-1">
            Manage Orders &rarr;
          </span>
        </Link>

        <Link
          to="/admin/payments"
          className="bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition rounded-3xl p-6 flex flex-col justify-between h-40 shadow-md group"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-gray-100 group-hover:text-[var(--color-primary)] transition">Payments Verification</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Review transaction reference codes, view uploaded screenshots, and verify payments.</p>
          </div>
          <span className="text-xs font-semibold text-[var(--color-primary)] group-hover:underline flex items-center gap-1">
            Verify Payments &rarr;
          </span>
        </Link>

        <Link
          to="/admin/cms"
          className="bg-[var(--color-card-bg)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition rounded-3xl p-6 flex flex-col justify-between h-40 shadow-md group"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-gray-100 group-hover:text-[var(--color-primary)] transition">Storefront CMS Config</h4>
            <p className="text-xs text-gray-400 leading-relaxed">Update phone numbers, social media coordinates, wallet details, and delivery charges.</p>
          </div>
          <span className="text-xs font-semibold text-[var(--color-primary)] group-hover:underline flex items-center gap-1">
            Configure CMS Settings &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;