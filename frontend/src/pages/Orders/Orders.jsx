import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders, cancelOrderAction } from "../../store/slices/orderSlice";
import toast from "react-hot-toast";
import { Package, Calendar, MapPin, ShieldAlert, ShoppingBag, ChevronDown, CreditCard } from "lucide-react";

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const T = {
  bg:         "#0a0a0b",
  card:       "#111114",
  hover:      "#16161a",
  border:     "#222228",
  gold:       "#c8860a",
  text:       "#f0ede8",
  muted:      "#6b6870",
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

/* ─── Cancel Button ──────────────────────────────────────────────────────── */
const CancelButton = ({ onClick, disabled, loading }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "system-ui, sans-serif",
        fontSize: 10, fontWeight: 800,
        textTransform: "uppercase", letterSpacing: "0.07em",
        padding: "7px 16px",
        background: hov ? "#260c0c" : T.dangerBg,
        border: `1px solid ${hov ? T.danger : T.dangerBdr}`,
        color: hov ? "#f87171" : T.danger,
        borderRadius: 0,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.18s ease",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {loading ? "Cancelling…" : "Cancel Order"}
    </button>
  );
};

/* ─── Delivery Details Block ─────────────────────────────────────────────── */
/*
  Layout: icon-free header label, then info rows that flex-wrap naturally.
  Email sits on the same line as Phone; if no room it wraps to the next line.
*/
const DeliveryDetails = ({ addr }) => {
  /* Each "pill" — a small label + value pair */
  const Pill = ({ label, value }) => (
    <span style={{
      display: "inline-flex",
      alignItems: "baseline",
      gap: 4,
      fontFamily: "system-ui, sans-serif",
      fontSize: 10,
      lineHeight: 1.6,
      whiteSpace: "normal",       /* allow value to wrap if needed */
      wordBreak: "break-all",     /* break long emails gracefully */
    }}>
      <span style={{ ...s.label, fontSize: 8, color: T.dim, flexShrink: 0 }}>{label}:</span>
      <span style={{ color: T.text, fontWeight: 600 }}>{value}</span>
    </span>
  );

  return (
    <div style={{
      background: "#0d0d10",
      border: `1px solid ${T.border}`,
      padding: "10px 14px",
    }}>
      {/* Header — styled like the "Order Progress" / "Activity History" labels */}
      <p style={{ ...s.label, marginBottom: 8 }}>Delivery Details</p>

      {/* Info rows — flex-wrap so Email naturally flows beside Phone or below */}
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

/* ─── Order Card (accordion) ─────────────────────────────────────────────── */
const OrderCard = ({ order, isOpen, onToggle, onCancel, cancelling }) => {
  const progress    = getTimelineProgress(order.orderStatus);
  const isCancellable =
    order.orderStatus === "Pending Payment Verification" ||
    order.orderStatus === "Approved";

  return (
    <div style={{ ...s.card, overflow: "hidden" }}>

      {/* ── Always-visible header row ── */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          background: isOpen ? T.hover : "transparent",
          border: "none",
          borderBottom: isOpen ? `1px solid ${T.border}` : "none",
          padding: "16px 24px",
          cursor: "pointer",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          transition: "background 0.18s ease",
        }}
      >
        {/* Left meta */}
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
          {/* Book names preview — always visible */}
          <div style={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 8 }}>
            {order.orderItems.map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 11, fontWeight: 600, color: T.text, letterSpacing: "-0.01em" }}>
                  {item.title}
                </span>
                <span style={{ ...s.label, fontSize: 8, color: T.dim }}>×{item.quantity}</span>
                <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 10, fontWeight: 700, color: T.gold }}>
                  Rs. {item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: badges + chevron */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <StatusBadge status={order.orderStatus} />
          <span style={{ fontFamily: "system-ui, sans-serif", fontSize: 15, fontWeight: 800, color: T.gold, letterSpacing: "-0.01em" }}>
            Rs.&nbsp;{order.totalPrice}
          </span>
          <ChevronDown
            size={15}
            color={T.dim}
            strokeWidth={2}
            style={{
              transition: "transform 0.25s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              flexShrink: 0,
            }}
          />
        </div>
      </button>

      {/* ── Expandable body ── */}
      <div style={{
        maxHeight: isOpen ? 2000 : 0,
        overflow: "hidden",
        transition: "max-height 0.35s ease",
      }}>
        <div style={{ padding: "20px 2px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Items */}
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

          {/* ── Delivery Details — no icon, label matches section labels style ── */}
          <DeliveryDetails addr={order.shippingAddress} />

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

          {/* Cancel button */}
          {isCancellable && (
            <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
              <CancelButton
                onClick={() => onCancel(order._id)}
                disabled={cancelling === order._id}
                loading={cancelling === order._id}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Loading Spinner ────────────────────────────────────────────────────── */
const Spinner = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
    <div style={{ width: 28, height: 28, border: `1px solid ${T.border}`, borderTop: `1px solid ${T.gold}`, borderRadius: 0, animation: "spin 0.7s linear infinite" }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* ─── Empty State ────────────────────────────────────────────────────────── */
const EmptyState = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "48px 24px", background: T.card, border: `1px dashed ${T.border}`, borderRadius: 0 }}>
    <Package size={36} color={T.dim} strokeWidth={1.5} />
    <div style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, fontWeight: 800, color: T.muted, letterSpacing: "-0.01em", marginBottom: 4 }}>
        No orders yet
      </p>
      <p style={{ ...s.label, color: T.dim, fontSize: 9 }}>Your purchase history will appear here</p>
    </div>
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────────────── */
const Orders = () => {
  const dispatch = useDispatch();
  const { myOrders, loading } = useSelector((state) => state.orders);
  const [cancellingId, setCancellingId] = useState(null);
  const [openOrderId, setOpenOrderId]   = useState(null);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  /* Auto-open the first order on load */
  useEffect(() => {
    if (myOrders.length > 0 && openOrderId === null) {
      setOpenOrderId(myOrders[0]._id);
    }
  }, [myOrders]);

  const handleToggle = (id) => {
    setOpenOrderId((prev) => (prev === id ? null : id));
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      setCancellingId(orderId);
      await dispatch(cancelOrderAction(orderId)).unwrap();
      toast.success("Order cancelled successfully!");
      dispatch(fetchMyOrders());
    } catch (error) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div style={{ background: T.bg, minHeight: "100%", padding: "0 0 48px", fontFamily: "system-ui, sans-serif" }}>

      {/* Page Header */}
      <div style={{ paddingBottom: 28, borderBottom: `1px solid ${T.border}`, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: T.gold, marginBottom: 10, fontFamily: "system-ui, sans-serif" }}>
          <ShoppingBag size={11} color={T.gold} strokeWidth={2} />
          Your Orders
        </div>
        <h1 style={{ fontFamily: "system-ui, sans-serif", fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, color: T.text, lineHeight: 1.15, margin: "0 0 6px", letterSpacing: "-0.01em" }}>
          My Orders
        </h1>
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: T.muted, margin: 0 }}>
          Track the progress and history of your purchases.
        </p>
      </div>

      {/* Body */}
      {loading && myOrders.length === 0 ? (
        <Spinner />
      ) : myOrders.length === 0 ? (
        <EmptyState />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {myOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              isOpen={openOrderId === order._id}
              onToggle={() => handleToggle(order._id)}
              onCancel={handleCancelOrder}
              cancelling={cancellingId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
