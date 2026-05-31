import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { Package, Calendar, MapPin, CheckCircle, Clock, Truck, ShieldAlert, ArrowLeft, CreditCard, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

const GuestTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/orders/${orderId}`);
        setOrder(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching guest order:", err);
        setError(err.response?.data?.message || "Failed to load order details. Please verify the URL link.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Timeline progress values
  const getTimelineProgress = (status) => {
    switch (status) {
      case "Pending Payment Verification":
        return 1;
      case "Payment Verified":
      case "Approved":
        return 2;
      case "Processing":
      case "Ready to Ship":
        return 3;
      case "Shipped":
      case "In Transit":
        return 4;
      case "Out for Delivery":
        return 5;
      case "Delivered":
        return 6;
      default:
        return -1;
    }
  };

  const stages = [
    { label: "Payment Verification", step: 1 },
    { label: "Approved", step: 2 },
    { label: "Processing", step: 3 },
    { label: "Shipped", step: 4 },
    { label: "Out for Delivery", step: 5 },
    { label: "Delivered", step: 6 },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-bg)] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
          <p className="text-sm text-gray-400">Loading Order Tracking Details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[var(--color-bg)] text-white p-6 space-y-6">
        <ShieldAlert size={64} className="text-red-500" />
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-2xl font-bold text-red-500">Order Tracking Error</h2>
          <p className="text-sm text-gray-400">{error || "Order not found or invalid URL."}</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-black font-bold rounded-none hover:opacity-90 transition cursor-pointer"
        >
          <ArrowLeft size={16} /> Return to Storefront
        </button>
      </div>
    );
  }

  const progress = getTimelineProgress(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-[var(--color-bg)] text-white py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="p-2 bg-neutral-900 border border-[var(--color-border)] rounded-none cursor-pointer hover:border-gray-500 transition"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-primary)]">Order Tracking</h1>
          <p className="text-xs text-gray-450 mt-1">Real-time status tracking for order #{order.orderNumber}</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-none py-6 px-[2px] md:px-6 space-y-6 shadow-md">
            {/* Status Header */}
            <div className="flex justify-between items-center border-b border-neutral-900 pb-4">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Reference ID</span>
                <span className="text-xs font-mono text-gray-300">{order._id}</span>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                order.orderStatus === "Cancelled"
                  ? "bg-red-950/40 border border-red-800 text-red-400"
                  : order.orderStatus === "Delivered"
                  ? "bg-emerald-950/40 border border-emerald-800 text-emerald-400"
                  : "bg-neutral-850 border border-neutral-700 text-gray-300"
              }`}>
                {order.orderStatus}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-[var(--color-primary)] uppercase tracking-wider">Ordered Items</h3>
              <div className="space-y-3">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.title} className="h-12 w-8 object-cover rounded-md" />
                      )}
                      <div>
                        <p className="font-medium text-gray-200">{item.title}</p>
                        <p className="text-[10px] text-gray-400">Qty: {item.quantity} | Rs. {item.price} each</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-300">Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="pt-4 border-t border-neutral-900 space-y-3">
              <h3 className="font-bold text-sm text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-2"><MapPin size={16} /> Delivery Details</h3>
              <div className="flex items-start gap-3 bg-neutral-900/40 border border-neutral-900 rounded-none py-4 px-[2px] md:px-4 text-xs text-gray-300">
                <div className="space-y-1">
                  <p><strong>Name:</strong> {order.shippingAddress.fullName}</p>
                  <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
                  <p className="break-all"><strong>Email:</strong> {order.shippingAddress.email}</p>
                  <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                </div>
              </div>
            </div>

            {/* Visual Timeline */}
            {progress !== -1 ? (
              <div className="pt-4 border-t border-neutral-900 space-y-4">
                <h3 className="font-bold text-sm text-[var(--color-primary)] uppercase tracking-wider">Order Progress</h3>
                <div className="relative flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 pt-2">
                  <div className="absolute top-1/2 left-0 h-0.5 w-full bg-neutral-850 -translate-y-1/2 hidden md:block z-0"></div>
                  <div
                    className="absolute top-1/2 left-0 h-0.5 bg-[var(--color-primary)] -translate-y-1/2 hidden md:block z-0 transition-all duration-500"
                    style={{ width: `${((progress - 1) / 5) * 100}%` }}
                  ></div>

                  {stages.map((stage) => {
                    const isDone = progress >= stage.step;
                    const isCurrent = progress === stage.step;
                    return (
                      <div key={stage.step} className="flex md:flex-col items-center gap-2 md:gap-1.5 z-10 w-full md:w-auto">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center border font-bold text-[10px] transition duration-300 ${
                          isDone
                            ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-black"
                            : "bg-neutral-900 border-neutral-700 text-gray-500"
                        } ${isCurrent ? "ring-4 ring-[var(--color-primary)]/20 scale-110" : ""}`}>
                          {isDone ? "✓" : stage.step}
                        </div>
                        <span className={`font-semibold text-center ${isDone ? "text-gray-250" : "text-gray-600"}`}>
                          {stage.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-red-950/20 border border-red-900/40 rounded-none py-4 px-[2px] md:px-4 text-xs text-red-400 font-semibold border-t border-neutral-900">
                <ShieldAlert size={16} />
                <span>This order has been cancelled or has entered a special state. Please contact customer support for further information.</span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Payment Card */}
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-none py-6 px-[2px] md:px-6 space-y-4 shadow-md text-xs text-gray-300">
            <h3 className="font-bold text-sm text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-2">
              <CreditCard size={16} /> Payment Summary
            </h3>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-bold text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className={`font-semibold ${
                  order.paymentStatus === "Paid" ? "text-emerald-400" : "text-yellow-500"
                }`}>{order.paymentStatus}</span>
              </div>
              {order.transactionId && (
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono text-white tracking-wider">{order.transactionId}</span>
                </div>
              )}
            </div>

            <div className="border-t border-neutral-900 pt-3 space-y-2 text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>Rs. {order.deliveryCharges}</span>
              </div>
              {order.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount:</span>
                  <span>- Rs. {order.couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-extrabold text-white border-t border-neutral-900 pt-2">
                <span>Grand Total:</span>
                <span className="text-[var(--color-primary)]">Rs. {order.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Detailed Activity Logs */}
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-none py-6 px-[2px] md:px-6 space-y-4 shadow-md text-xs">
            <h3 className="font-bold text-sm text-[var(--color-primary)] uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} /> Status History
            </h3>
            {order.timeline && order.timeline.length > 0 ? (
              <div className="relative pl-5 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-850 pt-2">
                {order.timeline.map((item, idx) => (
                  <div key={idx} className="relative space-y-1">
                    <span className="absolute -left-[19px] top-1 h-2 w-2 rounded-full bg-[var(--color-primary)]"></span>
                    <div className="flex flex-col text-gray-300 font-semibold">
                      <span>{item.status}</span>
                      <span className="text-[9px] text-gray-500 font-normal">{new Date(item.actionDate).toLocaleString()}</span>
                    </div>
                    {item.notes && <p className="text-gray-400 italic text-[11px] leading-tight">{item.notes}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 pt-2 text-center italic">No tracking updates logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestTracking;
