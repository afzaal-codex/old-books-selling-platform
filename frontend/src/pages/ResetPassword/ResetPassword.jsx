import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { BookOpen, Eye, EyeOff } from "lucide-react";
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
  danger:  "#ef4444",
};

/* ─── Reusable Field ─────────────────────────────────────────────────────── */
const Field = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{
      fontFamily:    "system-ui, sans-serif",
      fontSize:      9,
      fontWeight:    700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color:         T.muted,
    }}>
      {label}
    </label>
    {children}
  </div>
);

/* ─── Input style helper ─────────────────────────────────────────────────── */
const inputStyle = (extraStyle = {}) => ({
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
  ...extraStyle,
});

/* ─── Main Component ─────────────────────────────────────────────────────── */
const ResetPassword = () => {
  const { token }    = useParams();
  const navigate     = useNavigate();

  const [loading,             setLoading]             = useState(false);
  const [password,            setPassword]            = useState("");
  const [confirmPassword,     setConfirmPassword]     = useState("");
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const focusCss = `
    .rp-input:focus { border-color: ${T.gold} !important; }
    .rp-input::placeholder { color: ${T.dim}; }
    @media (max-width: 600px) {
      .rp-card { padding: 24px 20px !important; }
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
        className="rp-card"
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
            Reset Password
          </h1>
          <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: T.muted, margin: 0 }}>
            Create your new password
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* New Password */}
          <Field label="New Password">
            <div style={{ position: "relative" }}>
              <input
                className="rp-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle({ paddingRight: 48 })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position:   "absolute", right: 12, top: "50%",
                  transform:  "translateY(-50%)",
                  background: "none", border: "none",
                  cursor: "pointer", padding: 2,
                  color: T.dim, transition: "color 0.18s ease",
                  display: "flex", alignItems: "center",
                }}
                onMouseEnter={e => e.currentTarget.style.color = T.gold}
                onMouseLeave={e => e.currentTarget.style.color = T.dim}
              >
                {showPassword ? <EyeOff size={14} strokeWidth={2} /> : <Eye size={14} strokeWidth={2} />}
              </button>
            </div>
          </Field>

          {/* Confirm Password */}
          <Field label="Confirm Password">
            <div style={{ position: "relative" }}>
              <input
                className="rp-input"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle({ paddingRight: 48 })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position:   "absolute", right: 12, top: "50%",
                  transform:  "translateY(-50%)",
                  background: "none", border: "none",
                  cursor: "pointer", padding: 2,
                  color: T.dim, transition: "color 0.18s ease",
                  display: "flex", alignItems: "center",
                }}
                onMouseEnter={e => e.currentTarget.style.color = T.gold}
                onMouseLeave={e => e.currentTarget.style.color = T.dim}
              >
                {showConfirmPassword ? <EyeOff size={14} strokeWidth={2} /> : <Eye size={14} strokeWidth={2} />}
              </button>
            </div>
          </Field>

          {/* Submit Button */}
          <ResetBtn loading={loading} />
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

/* ─── Reset Button ───────────────────────────────────────────────────────── */
const ResetBtn = ({ loading }) => {
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
      {loading ? <ButtonLoader label="Updating..." /> : "Reset Password"}
    </button>
  );
};

export default ResetPassword;