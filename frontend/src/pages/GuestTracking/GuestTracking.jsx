import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { Package, Calendar, MapPin, ShieldAlert, ShoppingBag, ArrowLeft } from "lucide-react";

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const T = {
  bg:         "#0a0a0b",
  card:       "#111114",
  hover:      "#16161a",
  border:     "#222228",
  gold:       "#c8860a",
  text:       "#f0ede8",
  muted:      "#DCDCDC",
  dim:        "#44424a",
  success:    "#10b981",
  danger:     "#ef4444",
  dangerBg:   "#1a0808",
  dangerBdr:  "#3d1010",
  successBg:  "#071a12",
  successBdr: "#0d3d26",
};

const s = {
  label: {
    fontFamily: "system-ui, sans-serif",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: T.muted,
  },
  card: {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 0,
    fontFamily: "system-ui, sans-serif",
    transition: "all 0.18s ease",
  },
};

/* ─── Status Badge ───────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  let bg, bdr, color;
  if (status === "Cancelled")      { bg = T.dangerBg;  bdr = T.dangerBdr;  color = T.danger; }
  else if (status === "Delivered") { bg = T.successBg; bdr = T.successBdr; color = T.success; }
  else                             { bg = "#0e0e11";   bdr = T.border;     color = T.muted; }
  return (
    <span style={{
      background: bg, border: `1px solid ${bdr}`, color,
      fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
      textTransform: "uppercase", padding: "4px 10px",
      borderRadius: 0, fontFamily: "system-ui, sans-serif",
      whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
};

/* ─── Timeline ───────────────────────────────────────────────────────────── */
const stages = [
  { label: "Payment",          step: 1 },
  { label: "Approved",         step: 2 },
  { label: "Processing",       step: 3 },
  { label: "Shipped",          step: 4 },
  { label: "Out for Delivery", step: 5 },
  { label: "Delivered",        step: 6 },
];

const getTimelineProgress = (status) => {
  switch (status) {
    case "Pending Payment Verification": return 1;
    case "Payment Verified": case "Approved": return 2;
    case "Processing": case "Ready to Ship": return 3;
    case "Shipped": case "In Transit": return 4;
    case "Out for Delivery": return 5;
    case "Delivered": return 6;
    default: return -1;
  }
};

const DOT   = 24;
const TOTAL = stages.length;
const SEGS  = TOTAL - 1;

const OrderTimeline = ({ progress }) => {
  const completedSegs = Math.max(0, Math.min(progress - 1, SEGS));
  const goldPct = (completedSegs / SEGS) * 100;

  return (
    <div>
      <p style={{ ...s.label, marginBottom: 16 }}>Order Progress</p>

      {/* Desktop horizontal */}
      <div className="tl-desktop" style={{ position: "relative", display: "flex", alignItems: "flex-start" }}>
        <div style={{
          position: "absolute", top: `${DOT / 2}px`,
          left: `${(1 / (TOTAL * 2)) * 100}%`,
          width: `${((TOTAL - 1) / TOTAL) * 100}%`,
          height: 1, background: T.border,
          transform: "translateY(-50%)", zIndex: 0,
        }} />
        <div style={{
          position: "absolute", top: `${DOT / 2}px`,
          left: `${(1 / (TOTAL * 2)) * 100}%`,
          width: `${((TOTAL - 1) / TOTAL) * goldPct}%`,
          height: 1, background: T.gold,
          transform: "translateY(-50%)", zIndex: 1,
          transition: "width 0.5s ease",
        }} />
        {stages.map((stage) => {
          const done    = progress >= stage.step;
          const current = progress === stage.step;
          return (
            <div key={stage.step} style={{ flex: 1, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{
                width: DOT, height: DOT,
                background: done ? T.gold : T.card,
                border: `1px solid ${done ? T.gold : T.border}`,
                borderRadius: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 800,
                color: done ? "#000" : T.dim,
                fontFamily: "system-ui, sans-serif",
                transition: "all 0.18s ease",
                transform: current ? "scale(1.18)" : "scale(1)",
                boxShadow: current ? `0 0 0 3px ${T.gold}28` : "none",
                flexShrink: 0,
              }}>
                {done ? "✓" : stage.step}
              </div>
              <span style={{ ...s.label, fontSize: 8, color: done ? T.text : T.dim, textAlign: "center", letterSpacing: "0.10em" }}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile dots only */}
      <div className="tl-mobile" style={{ display: "none" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-start" }}>
          {stages.map((stage) => {
            const done    = progress >= stage.step;
            const current = progress === stage.step;
            return (
              <div key={stage.step} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flex: "1 0 calc(33% - 8px)" }}>
                <div style={{
                  width: 22, height: 22,
                  background: done ? T.gold : T.card,
                  border: `1px solid ${done ? T.gold : T.border}`,
                  borderRadius: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 8, fontWeight: 800,
                  color: done ? "#000" : T.dim,
                  fontFamily: "system-ui, sans-serif",
                  transform: current ? "scale(1.15)" : "scale(1)",
                  boxShadow: current ? `0 0 0 3px ${T.gold}28` : "none",
                  transition: "all 0.18s ease",
                }}>
                  {done ? "✓" : stage.step}
                </div>
                <span style={{ ...s.label, fontSize: 7, color: done ? T.text : T.dim, textAlign: "center" }}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .tl-desktop { display: none !important; }
          .tl-mobile  { display: block !important; }
        }
      `}</style>
    </div>
  );
};

/* ─── Activity Log ───────────────────────────────────────────────────────── */
const ActivityLog = ({ timeline }) => (
  <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20, marginTop: 4 }}>
    <p style={{ ...s.label, marginBottom: 16 }}>Activity History</p>
    <div style={{ position: "relative", paddingLeft: 20 }}>
      <div style={{ position: "absolute", left: 4, top: 6, bottom: 6, width: 1, background: T.border }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {timeline.map((item, idx) => (
          <div key={idx} style={{ position: "relative" }}>
            <div style={{
              position: "absolute", left: -20, top: 3,
              width: 9, height: 9,
              background: T.gold, border: `1px solid ${T.bg}`,
              borderRadius: 0,
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 4, marginBottom: 2 }}>
              <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 11, fontWeight: 700, color: T.text, letterSpacing: "-0.01em" }}>
                {item.status}
              </span>
              <span style={{ ...s.label, fontSize: 9, letterSpacing: "0.08em" }}>
                {new Date(item.actionDate).toLocaleString()}
              </span>
            </div>
            {item.notes && (
              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 10, color: T.muted, fontStyle: "italic", lineHeight: 1.5, marginBottom: 2 }}>
                {item.notes}
              </p>
            )}
            <span style={{ ...s.label, fontSize: 8, color: T.dim }}>
              Logged by: {item.actionBy || "System"}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Delivery Details Block ─────────────────────────────────────────────── */
const DeliveryDetails = ({ addr, status }) => {
  const isDelivered = status === "Delivered";
  const Pill = ({ label, value }) => (
    <span style={{
      display: "inline-flex",
      alignItems: "baseline",
      gap: 4,
      fontFamily: "system-ui, sans-serif",
      fontSize: 10,
      lineHeight: 1.6,
      whiteSpace: "normal",
      wordBreak: "break-all",
    }}>
      <span style={{ ...s.label, fontSize: 8, color: T.gold, flexShrink: 0 }}>{label}:</span>
      <span style={{ color: T.text, fontWeight: 600 }}>{value}</span>
    </span>
  );

  return (
    <div
      className="px-[2px] md:px-[14px]"
      style={{
        background: "#0d0d10",
        border: `1px solid ${T.border}`,
        paddingTop: 10,
        paddingBottom: 10,
      }}
    >
      <p style={{ ...s.label, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
        <MapPin size={11} color={T.gold} strokeWidth={2} style={{ flexShrink: 0 }} />
        Delivery Details
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
        <Pill label="Name"    value={addr.fullName} />
        <Pill label="Address" value={`${addr.address}, ${addr.city}`} />
        <Pill label="Phone"   value={addr.phone} />
        {addr.email && (
          <Pill label="Email" value={addr.email} />
        )}
      </div>
    </div>
  );
};

/* ─── Main GuestTracking Component ───────────────────────────────────────── */
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

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContext: "center", height: "100vh", background: T.bg }} className="flex justify-center items-center">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 28, border: `1px solid ${T.border}`, borderTop: `1px solid ${T.gold}`, borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: T.muted }}>Loading Order Tracking Details...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", background: T.bg, padding: 24, gap: 24 }}>
        <ShieldAlert size={48} color={T.danger} strokeWidth={1.5} />
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
          <h2 style={{ fontFamily: "system-ui, sans-serif", fontSize: 20, fontWeight: 800, color: T.danger }}>Order Tracking Error</h2>
          <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: T.muted }}>{error || "Order not found or invalid URL."}</p>
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: 10, fontWeight: 800,
            textTransform: "uppercase", letterSpacing: "0.08em",
            padding: "12px 24px",
            background: T.gold,
            color: "#000",
            border: "none",
            borderRadius: 0,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "opacity 0.18s ease",
          }}
          onMouseEnter={(e) => e.target.style.opacity = 0.85}
          onMouseLeave={(e) => e.target.style.opacity = 1}
        >
          <ArrowLeft size={12} strokeWidth={2.5} /> Return to Storefront
        </button>
      </div>
    );
  }

  const progress = getTimelineProgress(order.orderStatus);

  return (
    <div style={{ background: T.bg, minHeight: "100%", padding: "24px 0 48px", fontFamily: "system-ui, sans-serif" }} className="px-4">
      <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
        {/* Page Header */}
        <div style={{ paddingBottom: 28, borderBottom: `1px solid ${T.border}`, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: T.gold }}>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: T.gold,
                fontFamily: "system-ui, sans-serif",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: 0,
              }}
            >
              <ArrowLeft size={11} strokeWidth={2.5} />
              Back to Store
            </button>
          </div>
          <div>
            <h1 style={{ fontFamily: "system-ui, sans-serif", fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, color: T.text, lineHeight: 1.15, margin: "0 0 6px", letterSpacing: "-0.01em" }}>
              Order Tracking
            </h1>
            <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: T.muted, margin: 0 }}>
              Real-time status tracking for order #{order.orderNumber}
            </p>
          </div>
        </div>

        {/* Order Details Card */}
        <div style={{ ...s.card, overflow: "hidden" }}>
          {/* Card Header Row */}
          <div
            className="px-[2px] md:px-6"
            style={{
              width: "100%",
              background: T.hover,
              borderBottom: `1px solid ${T.border}`,
              paddingTop: 16,
              paddingBottom: 16,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* Left Meta */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, textAlign: "left" }}>
              {order.orderNumber && (
                <span style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 11, fontWeight: 800,
                  textTransform: "uppercase", letterSpacing: "0.07em",
                  color: T.muted,
                }}>
                  Order&nbsp;<span style={{ color: T.gold }}>{order.orderNumber}</span>
                </span>
              )}
              <span style={{ ...s.label, fontSize: 8, color: T.dim }}>
                ID: {order._id}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "system-ui, sans-serif", fontSize: 10, color: T.muted }}>
                <Calendar size={11} color={T.gold} strokeWidth={2} />
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Right Status / Price */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <StatusBadge status={order.orderStatus} />
              <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 15, fontWeight: 800, color: T.gold, letterSpacing: "-0.01em" }}>
                Rs.&nbsp;{order.totalPrice}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Ordered Items */}
            <div>
              <p style={{ ...s.label, marginBottom: 12 }}>Ordered Items</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {order.orderItems.map((item, idx) => (
                  <div key={idx} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 0",
                    borderBottom: idx < order.orderItems.length - 1 ? `1px solid ${T.border}` : "none",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {item.image && (
                        <img src={item.image} alt={item.title} style={{ width: 28, height: 40, objectFit: "cover", border: `1px solid ${T.border}`, borderRadius: 0, flexShrink: 0 }} />
                      )}
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 12, fontWeight: 600, color: T.text }}>
                          {item.title}
                        </span>
                        <span style={{ ...s.label, fontSize: 8, color: T.dim }}>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 11, fontWeight: 700, color: T.text }}>
                      Rs.&nbsp;{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Invoice Breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "#0d0d10", border: `1px solid ${T.border}`, padding: "16px 20px" }}>
              <p style={{ ...s.label, marginBottom: 4 }}>Payment & Cost Summary</p>
              <div style={{ display: "grid", gap: "16px 24px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                {/* Payment info */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, color: T.muted }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Payment Method:</span>
                    <strong style={{ color: T.text }}>{order.paymentMethod}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Payment Status:</span>
                    <strong style={{ color: order.paymentStatus === "Paid" ? T.success : T.gold }}>{order.paymentStatus}</strong>
                  </div>
                  {order.transactionId && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Transaction ID:</span>
                      <strong style={{ color: T.text, fontFamily: "monospace" }}>{order.transactionId}</strong>
                    </div>
                  )}
                </div>
                {/* Cost breakdown */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, color: T.muted }} className="pricing-border-left">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Subtotal:</span>
                    <span style={{ color: T.text }}>Rs. {order.subtotal}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Delivery Charges:</span>
                    <span style={{ color: T.text }}>Rs. {order.deliveryCharges}</span>
                  </div>
                  {order.couponDiscount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: T.success }}>
                      <span>Discount:</span>
                      <span>- Rs. {order.couponDiscount}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 800, color: T.text, borderTop: `1px solid ${T.border}`, paddingTop: 6, marginTop: 4 }}>
                    <span>Total Paid:</span>
                    <span style={{ color: T.gold }}>Rs. {order.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <DeliveryDetails addr={order.shippingAddress} status={order.orderStatus} />

            {/* Timeline or cancelled */}
            {progress !== -1 ? (
              <OrderTimeline progress={progress} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.dangerBg, border: `1px solid ${T.dangerBdr}`, padding: "10px 14px" }}>
                <ShieldAlert size={13} color={T.danger} strokeWidth={2} style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 10, fontWeight: 700, color: T.danger, letterSpacing: "0.04em" }}>
                  This order has been cancelled — items returned to inventory stock.
                </span>
              </div>
            )}

            {/* Activity logs */}
            {order.timeline && order.timeline.length > 0 && (
              <ActivityLog timeline={order.timeline} />
            )}
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 600px) {
          .pricing-border-left {
            border-left: 1px solid ${T.border};
            padding-left: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default GuestTracking;
