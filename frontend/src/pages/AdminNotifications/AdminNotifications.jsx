import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markNotificationRead } from "../../store/slices/notificationSlice";
import { Bell, Check, Clock, Info, ShieldAlert, ShoppingBag, DollarSign } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

const AdminNotifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = async (id) => {
    try {
      await dispatch(markNotificationRead(id)).unwrap();
      toast.success("Notification marked as read");
    } catch (err) {
      toast.error("Failed to update notification status");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="text-blue-400 w-5 h-5" />;
      case "payment":
        return <DollarSign className="text-emerald-400 w-5 h-5" />;
      case "system":
        return <ShieldAlert className="text-red-400 w-5 h-5" />;
      default:
        return <Info className="text-[var(--color-primary)] w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 bg-[var(--color-bg)] text-white pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">System Alerts & Notifications</h1>
          <p className="text-sm text-gray-400 mt-2">Monitor recent admin actions, customer payments, and orders</p>
        </div>
      </div>

      {loading && notifications.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-gray-400">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-card-bg)] p-8 text-center">
          <Bell size={48} className="text-gray-500 mb-4 animate-bounce" />
          <p className="text-gray-400 text-lg font-semibold">No recent alerts or notifications</p>
          <p className="text-sm text-gray-500 mt-1">You will be alerted here when new orders are placed or payments submitted.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex justify-between items-start gap-4 ${
                notif.read
                  ? "bg-[var(--color-card-bg)] border-[var(--color-border)] opacity-60"
                  : "bg-[var(--color-card-bg)] border-[var(--color-primary)]/40 shadow-[0_0_15px_rgba(212,175,55,0.05)]"
              }`}
            >
              <div className="flex gap-4">
                <div className="p-3 bg-black/45 rounded-xl border border-[var(--color-border)] h-fit">
                  {getIcon(notif.type)}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    {notif.title}
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                    <Clock size={11} /> {dayjs(notif.createdAt).fromNow()}
                  </p>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={() => handleMarkAsRead(notif._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] bg-black/40 text-xs font-semibold cursor-pointer transition duration-300"
                  title="Mark as Read"
                >
                  <Check size={13} />
                  <span>Mark Read</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
