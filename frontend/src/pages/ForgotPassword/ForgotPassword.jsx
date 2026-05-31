import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { BookOpen } from "lucide-react";
import ButtonLoader from "../../components/loaders/ButtonLoader";

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const T = {
  bg:      "#0a0a0b",
  card:    "#111114",
  input:   "#0d0d10",
  border:  "#222228",
  gold:    "#c8860a",
  text:    "#f0ede8",
  muted:   "#DCDCDC",
  dim:     "#44424a",
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const ForgotPassword = () => {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/forgot-password", { email });
      toast.success(response.data.message);
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const focusCss = `
    .fp-input:focus { border-color: ${T.gold} !important; }
    .fp-input::placeholder { color: ${T.dim}; }
    @media (max-width: 600px) {
      .fp-card { padding: 24px 20px !important; }
    }
  `;

  return (
    <div style={{
      minHeight:      "100vh",
      background:     T.bg,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      padding:        "24px 16px",
      fontFamily:     "system-ui, sans-serif",
    }}>
      <style>{focusCss}</style>

      {/* ── Auth card ── */}
      <div
        className="fp-card"
        style={{
          width:        "100%",
          maxWidth:     520,
          background:   T.card,
          border:       `1px solid ${T.border}`,
          borderRadius: 0,
          padding:      "36px 40px 28px",
          boxShadow:    "0 8px 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            display:        "inline-flex",
            alignItems:     "center",
            justifyContent: "center",
            gap:            4,
            fontSize:       10,
            fontWeight:     600,
            letterSpacing:  "0.14em",
            textTransform:  "uppercase",
            color:          T.muted,
            marginBottom:   3,
          }}>
            <BookOpen size={11} color={T.gold} strokeWidth={2} />
            Bookstore Account
          </div>
          <h1 style={{
            fontFamily:    "system-ui, sans-serif",
            fontSize:      26,
            fontWeight:    800,
            color:         T.gold,
            lineHeight:    1.15,
            letterSpacing: "-0.01em",
            margin:        "0 0 4px",
          }}>
            Forgot Password
          </h1>
          <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: T.muted, margin: 0 }}>
            Enter your email to receive a reset link
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{
              fontFamily:    "system-ui, sans-serif",
              fontSize:      9,
              fontWeight:    700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color:         T.muted,
            }}>
              Email Address
            </label>
            <input
              className="fp-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width:        "100%",
                boxSizing:    "border-box",
                background:   T.input,
                border:       `1px solid ${T.border}`,
                borderRadius: 0,
                padding:      "10px 14px",
                fontFamily:   "system-ui, sans-serif",
                fontSize:     13,
                color:        T.text,
                outline:      "none",
                transition:   "border-color 0.18s ease",
              }}
            />
          </div>

          {/* Submit Button */}
          <SendLinkBtn loading={loading} />
        </form>

        {/* ── Divider ── */}
        <div style={{ borderTop: `1px solid ${T.border}`, margin: "22px 0 16px" }} />

        {/* ── Footer ── */}
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 12, color: T.muted, textAlign: "center", margin: 0 }}>
          Remembered your password?&nbsp;
          <a
            href="/login"
            style={{ color: T.gold, fontWeight: 700, textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

/* ─── Send Link Button ───────────────────────────────────────────────────── */
const SendLinkBtn = ({ loading }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="submit"
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:         "100%",
        marginTop:     4,
        background:    loading ? "#9a6608" : hov ? "#b07808" : "#c8860a",
        border:        "none",
        borderRadius:  0,
        padding:       "11px 0",
        fontFamily:    "system-ui, sans-serif",
        fontSize:      10,
        fontWeight:    800,
        textTransform: "uppercase",
        letterSpacing: "0.10em",
        color:         "#000",
        cursor:        loading ? "not-allowed" : "pointer",
        opacity:       loading ? 0.7 : 1,
        transition:    "all 0.18s ease",
      }}
    >
      {loading ? <ButtonLoader label="Sending..." /> : "Send Reset Link"}
    </button>
  );
};

export default ForgotPassword;