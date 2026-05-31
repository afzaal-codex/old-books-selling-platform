import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markNotificationRead } from "../../store/slices/notificationSlice";
import { fetchMyOrders } from "../../store/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  User, Mail, Phone, Bell, ShieldCheck,
  ShoppingBag, Check, Calendar, UserCircle2,
} from "lucide-react";

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
  successBg:  "#071a12",
  successBdr: "#0d3d26",
};

const s = {
  label: {
    fontFamily:    "system-ui, sans-serif",
    fontSize:      9,
    fontWeight:    700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color:         T.muted,
  },
};

/* ─── Tab Button ─────────────────────────────────────────────────────────── */
const TabBtn = ({ active, onClick, children, badge }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily:    "system-ui, sans-serif",
        fontSize:      10,
        fontWeight:    800,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        padding:       "8px 16px",
        borderRadius:  0,
        border:        `1px solid ${active ? T.gold : hov ? "#333339" : T.border}`,
        background:    active ? T.gold : hov ? T.hover : T.card,
        color:         active ? "#000" : hov ? T.text : T.muted,
        cursor:        "pointer",
        transition:    "all 0.18s ease",
        position:      "relative",
        display:       "flex",
        alignItems:    "center",
        gap:           6,
      }}
    >
      {children}
      {badge > 0 && (
        <span style={{
          display:       "inline-flex",
          alignItems:    "center",
          justifyContent:"center",
          minWidth:      16,
          height:        16,
          padding:       "0 4px",
          background:    active ? "rgba(0,0,0,0.25)" : T.gold,
          color:         active ? "#000" : "#000",
          fontSize:      8,
          fontWeight:    800,
          borderRadius:  0,
          letterSpacing: "0.04em",
        }}>
          {badge}
        </span>
      )}
    </button>
  );
};

/* ─── Info Row ───────────────────────────────────────────────────────────── */
const InfoRow = ({ icon: Icon, label, value }) => (
  <div style={{
    display:       "flex",
    alignItems:    "center",
    gap:           12,
    padding:       "12px 0",
    borderBottom:  `1px solid ${T.border}`,
  }}>
    <div style={{
      width:          32,
      height:         32,
      background:     "#0d0d10",
      border:         `1px solid ${T.border}`,
      borderRadius:   0,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      flexShrink:     0,
    }}>
      <Icon size={13} color={T.gold} strokeWidth={2} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ ...s.label, fontSize: 8 }}>{label}</span>
      <span style={{
        fontFamily: "system-ui, sans-serif",
        fontSize:   12,
        fontWeight: 700,
        color:      T.text,
      }}>
        {value || "Not provided"}
      </span>
    </div>
  </div>
);

/* ─── Notification Item ──────────────────────────────────────────────────── */
const NotifItem = ({ notif, onMarkRead }) => {
  const [hov, setHov] = useState(false);
  const unread = !notif.read;

  return (
    <div style={{
      display:       "flex",
      justifyContent:"space-between",
      alignItems:    "flex-start",
      gap:           12,
      padding:       "12px 14px",
      background:    unread ? `${T.gold}08` : "#0d0d10",
      border:        `1px solid ${unread ? `${T.gold}22` : T.border}`,
      borderRadius:  0,
      transition:    "all 0.18s ease",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        <span style={{
          fontFamily:   "system-ui, sans-serif",
          fontSize:     12,
          fontWeight:   700,
          color:        unread ? T.gold : T.text,
          letterSpacing:"-0.01em",
        }}>
          {notif.title}
        </span>
        <p style={{
          fontFamily: "system-ui, sans-serif",
          fontSize:   11,
          color:      T.muted,
          lineHeight: 1.5,
          margin:     0,
        }}>
          {notif.message}
        </p>
        <span style={{ ...s.label, fontSize: 8, color: T.dim }}>
          {new Date(notif.createdAt).toLocaleString()}
        </span>
      </div>

      {unread && (
        <button
          onClick={() => onMarkRead(notif._id)}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          title="Mark as read"
          style={{
            width:          28,
            height:         28,
            background:     hov ? T.successBg : "#0d0d10",
            border:         `1px solid ${hov ? T.success : T.border}`,
            borderRadius:   0,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            cursor:         "pointer",
            transition:     "all 0.18s ease",
            flexShrink:     0,
          }}
        >
          <Check size={12} color={T.success} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const Profile = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const { user }          = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);
  const { myOrders }      = useSelector((state) => state.orders);

  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleMarkRead = async (id) => {
    try {
      await dispatch(markNotificationRead(id)).unwrap();
      toast.success("Notification marked as read");
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const initial     = user?.name?.charAt(0)?.toUpperCase() || "U";
  const totalSpent  = myOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <div style={{
      background:  T.bg,
      minHeight:   "100%",
      padding:     "0 0 48px",
      fontFamily:  "system-ui, sans-serif",
    }}>

      {/* ── Page Header — cart-header eyebrow style ── */}
      <div style={{
        paddingBottom: 28,
        borderBottom:  `1px solid ${T.border}`,
        marginBottom:  28,
      }}>
        {/* Eyebrow */}
        <div style={{
          display:       "flex",
          alignItems:    "center",
          gap:           7,
          fontSize:      11,
          fontWeight:    600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color:         T.gold,
          marginBottom:  10,
          fontFamily:    "system-ui, sans-serif",
        }}>
          <UserCircle2 size={11} color={T.gold} strokeWidth={2} />
          Account Center
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily:   "system-ui, sans-serif",
          fontSize:     "clamp(26px, 4vw, 36px)",
          fontWeight:   800,
          color:        T.text,
          lineHeight:   1.15,
          margin:       "0 0 6px",
          letterSpacing:"-0.01em",
        }}>
          My Profile
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: "system-ui, sans-serif",
          fontSize:   13,
          color:      T.muted,
          margin:     0,
        }}>
          Manage your account information and notifications.
        </p>
      </div>

      {/* ── Hero card ── */}
      <div style={{
        background:    T.card,
        border:        `1px solid ${T.border}`,
        borderRadius:  0,
        padding:       "20px 24px",
        display:       "flex",
        flexWrap:      "wrap",
        justifyContent:"space-between",
        alignItems:    "center",
        gap:           16,
        marginBottom:  1,
      }}>
        {/* Left — avatar + meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Square avatar */}
          <div style={{
            width:          52,
            height:         52,
            background:     T.gold,
            borderRadius:   0,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            fontSize:       22,
            fontWeight:     800,
            color:          "#000",
            letterSpacing:  "-0.02em",
            fontFamily:     "system-ui, sans-serif",
            flexShrink:     0,
          }}>
            {initial}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{
              fontFamily:   "system-ui, sans-serif",
              fontSize:     18,
              fontWeight:   800,
              color:        T.text,
              lineHeight:   1.15,
              letterSpacing:"-0.01em",
            }}>
              {user?.name}
            </span>

            {/* Badges row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {/* Verified badge */}
              <span style={{
                display:       "inline-flex",
                alignItems:    "center",
                gap:           5,
                background:    T.successBg,
                border:        `1px solid ${T.successBdr}`,
                color:         T.success,
                fontSize:      8,
                fontWeight:    700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding:       "3px 8px",
                borderRadius:  0,
              }}>
                <ShieldCheck size={9} strokeWidth={2.5} />
                Verified Account
              </span>

              {/* Join date */}
              <span style={{
                display:       "inline-flex",
                alignItems:    "center",
                gap:           5,
                background:    "#0d0d10",
                border:        `1px solid ${T.border}`,
                color:         T.dim,
                fontSize:      8,
                fontWeight:    700,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                padding:       "3px 8px",
                borderRadius:  0,
              }}>
                <Calendar size={9} strokeWidth={2} />
                Joined {new Date(user?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right — tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          <TabBtn active={activeTab === "info"} onClick={() => setActiveTab("info")}>
            My Information
          </TabBtn>
          <TabBtn
            active={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
            badge={unreadCount}
          >
            Notifications
          </TabBtn>
        </div>
      </div>

      {/* ── Tab content ── */}
      {activeTab === "info" ? (

        /* ── INFO TAB: 2-col layout ── */
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 1 }}
             className="profile-grid">

          {/* User information panel */}
          <div style={{
            background:   T.card,
            border:       `1px solid ${T.border}`,
            borderRadius: 0,
            padding:      "20px 24px",
          }}
            className="profile-info-col"
          >
            <h3 style={{
              fontFamily:   "system-ui, sans-serif",
              fontSize:     13,
              fontWeight:   800,
              color:        T.text,
              letterSpacing:"-0.01em",
              margin:       "0 0 4px",
            }}>
              Contact Information
            </h3>
            <p style={{ ...s.label, fontSize: 8, color: T.dim, marginBottom: 8 }}>
              Your account details on file
            </p>

            <div>
              <InfoRow icon={User}     label="Full Name"      value={user?.name} />
              <InfoRow icon={Mail}     label="Email Address"  value={user?.email} />
              <InfoRow icon={Phone}    label="Phone Number"   value={user?.phone} />
            </div>
          </div>

          {/* Purchase stats panel */}
          <div style={{
            background:    T.card,
            border:        `1px solid ${T.border}`,
            borderRadius:  0,
            padding:       "20px 24px",
            display:       "flex",
            flexDirection: "column",
            alignItems:    "flex-start",
            gap:           16,
          }}
            className="profile-stats-col"
          >
            <div>
              <h3 style={{
                fontFamily:   "system-ui, sans-serif",
                fontSize:     13,
                fontWeight:   800,
                color:        T.text,
                letterSpacing:"-0.01em",
                margin:       "0 0 4px",
              }}>
                Purchase Summary
              </h3>
              <p style={{ ...s.label, fontSize: 8, color: T.dim }}>
                Your order history at a glance
              </p>
            </div>

            {/* Icon + count */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width:          44,
                height:         44,
                background:     "#0d0d10",
                border:         `1px solid ${T.border}`,
                borderRadius:   0,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                flexShrink:     0,
              }}>
                <ShoppingBag size={18} color={T.gold} strokeWidth={1.75} />
              </div>
              <div>
                <span style={{
                  fontFamily:   "system-ui, sans-serif",
                  fontSize:     32,
                  fontWeight:   800,
                  color:        T.text,
                  lineHeight:   1,
                  letterSpacing:"-0.02em",
                  display:      "block",
                }}>
                  {myOrders.length}
                </span>
                <span style={{ ...s.label, fontSize: 8, color: T.dim }}>
                  Total purchases placed
                </span>
              </div>
            </div>

            {/* Total Spent */}
            <div style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "14px 0",
              borderTop: `1px solid ${T.border}`,
            }}>
              <div style={{
                width: 44, height: 44,
                background: "#0d0d10",
                border: `1px solid ${T.border}`,
                borderRadius: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: T.gold }}>₨</span>
              </div>
              <div>
                <span style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: T.gold,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  display: "block",
                }}>
                  PKR {totalSpent.toLocaleString()}
                </span>
                <span style={{ ...s.label, fontSize: 8, color: T.dim }}>
                  Total amount spent
                </span>
              </div>
            </div>

            <ViewOrdersBtn onClick={() => navigate("/orders")} />
          </div>

          <style>{`
            @media (min-width: 768px) {
              .profile-grid { grid-template-columns: 1fr 1fr !important; }
              .profile-info-col { grid-column: 1 / 2; }
              .profile-stats-col { grid-column: 2 / 3; }
            }
          `}</style>
        </div>

      ) : (

        /* ── NOTIFICATIONS TAB ── */
        <div style={{
          background:   T.card,
          border:       `1px solid ${T.border}`,
          borderRadius: 0,
          padding:      "20px 24px",
        }}>
          {/* Header */}
          <div style={{
            display:       "flex",
            justifyContent:"space-between",
            alignItems:    "center",
            marginBottom:  16,
            paddingBottom: 12,
            borderBottom:  `1px solid ${T.border}`,
          }}>
            <h3 style={{
              fontFamily:   "system-ui, sans-serif",
              fontSize:     13,
              fontWeight:   800,
              color:        T.text,
              letterSpacing:"-0.01em",
              margin:       0,
            }}>
              Notification Center
            </h3>
            <span style={{
              fontFamily:   "system-ui, sans-serif",
              fontSize:     10,
              color:        T.muted,
            }}>
              <span style={{ color: T.gold, fontWeight: 800 }}>{unreadCount}</span>
              {" "}unread
            </span>
          </div>

          {/* Empty state */}
          {notifications.length === 0 ? (
            <div style={{
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              justifyContent: "center",
              padding:        "48px 0",
              gap:            8,
            }}>
              <Bell size={28} color={T.dim} strokeWidth={1.5} />
              <p style={{
                fontFamily: "system-ui, sans-serif",
                fontSize:   12,
                color:      T.muted,
                margin:     0,
              }}>
                No notifications yet.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {notifications.map((notif) => (
                <NotifItem
                  key={notif._id}
                  notif={notif}
                  onMarkRead={handleMarkRead}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── View Orders Button ─────────────────────────────────────────────────── */
const ViewOrdersBtn = ({ onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily:    "system-ui, sans-serif",
        fontSize:      10,
        fontWeight:    800,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        padding:       "9px 20px",
        background:    hov ? T.hover : "#0d0d10",
        border:        `1px solid ${hov ? T.gold : T.border}`,
        color:         hov ? T.gold : T.text,
        borderRadius:  0,
        cursor:        "pointer",
        transition:    "all 0.18s ease",
        display:       "flex",
        alignItems:    "center",
        gap:           6,
      }}
    >
      <ShoppingBag size={11} strokeWidth={2} />
      View Order History
    </button>
  );
};

export default Profile;