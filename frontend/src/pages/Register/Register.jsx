import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setAuth } from "../../store/slices/authSlice";
import axiosInstance from "../../utils/axiosInstance";
import ButtonLoader from "../../components/loaders/ButtonLoader";
import { BookOpen, Eye, EyeOff } from "lucide-react";

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const T = {
  bg:      "#0a0a0b",
  card:    "#111114",
  input:   "#0d0d10",
  border:  "#222228",
  gold:    "#c8860a",
  text:    "#f0ede8",
  muted:   "#6b6870",
  dim:     "#44424a",
  danger:  "#ef4444",
  success: "#10b981",
};

/* ─── Reusable Field ─────────────────────────────────────────────────────── */
const Field = ({ label, error, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{
      fontFamily:    "system-ui, sans-serif",
      fontSize:      9,
      fontWeight:    700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color:         error ? T.danger : T.muted,
    }}>
      {label}
    </label>
    {children}
    {error && (
      <span style={{
        fontFamily: "system-ui, sans-serif",
        fontSize:   10,
        color:      T.danger,
        marginTop:  -2,
      }}>
        {error}
      </span>
    )}
  </div>
);

/* ─── Input styles (returned as object for inline use) ───────────────────── */
const inputStyle = (hasError, extraStyle = {}) => ({
  width:         "100%",
  boxSizing:     "border-box",
  background:    T.input,
  border:        `1px solid ${hasError ? T.danger : T.border}`,
  borderRadius:  0,
  padding:       "10px 14px",
  fontFamily:    "system-ui, sans-serif",
  fontSize:      13,
  color:         T.text,
  outline:       "none",
  transition:    "border-color 0.18s ease",
  ...extraStyle,
});

/* ─── Main Component ─────────────────────────────────────────────────────── */
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading,             setLoading]             = useState(false);
  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTP,             setShowOTP]             = useState(false);
  const [otp,                 setOTP]                 = useState("");
  const [errors,              setErrors]              = useState({});
  const [formData,            setFormData]            = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev)   => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim())            newErrors.name            = "Name is required";
    if (!formData.email.trim())           newErrors.email           = "Email is required";
    if (!formData.phone.trim())           newErrors.phone           = "Phone is required";
    if (!formData.password)               newErrors.password        = "Password is required";
    if (!formData.confirmPassword)        newErrors.confirmPassword = "Confirm password required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email))
      newErrors.email = "Invalid email format";
    if (formData.password && formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) { toast.error("Please fix validation errors"); return false; }
    return true;
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/send-signup-otp", {
        email: formData.email.trim().toLowerCase(),
      });
      toast.success(response.data.message);
      setShowOTP(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/verify-signup-otp", {
        name:            formData.name.trim(),
        email:           formData.email.trim().toLowerCase(),
        phone:           formData.phone.trim(),
        password:        formData.password,
        confirmPassword: formData.confirmPassword,
        otp,
      });
      toast.success(response.data.message);
      dispatch(setAuth({ token: response.data.token, user: response.data.user, isAdmin: response.data.isAdmin }));
      if (response.data.isAdmin) navigate("/admin"); else navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* focus gold border via CSS class */
  const focusCss = `
    .reg-input:focus { border-color: ${T.gold} !important; }
    .reg-input::placeholder { color: ${T.dim}; }
    @media (max-width: 600px) {
      .reg-card { padding: 24px 20px !important; }
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
        className="reg-card"
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
            fontFamily:   "system-ui, sans-serif",
            fontSize:     26,
            fontWeight:   800,
            color:        T.gold,
            lineHeight:   1.15,
            letterSpacing:"-0.01em",
            margin:       "0 0 4px",
          }}>
            Create Account
          </h1>
          <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: T.muted, margin: 0 }}>
            Join our online bookstore community
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={sendOTP} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Name */}
          <Field label="Full Name" error={errors.name}>
            <input
              className="reg-input"
              type="text" name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              style={inputStyle(errors.name)}
            />
          </Field>

          {/* Email */}
          <Field label="Email Address" error={errors.email}>
            <input
              className="reg-input"
              type="email" name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={inputStyle(errors.email)}
            />
          </Field>

          {/* Phone */}
          <Field label="Phone Number" error={errors.phone}>
            <input
              className="reg-input"
              type="text" name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              style={inputStyle(errors.phone)}
            />
          </Field>

          {/* Password */}
          <Field label="Password" error={errors.password}>
            <div style={{ position: "relative" }}>
              <input
                className="reg-input"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                style={inputStyle(errors.password, { paddingRight: 48 })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position:  "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)",
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
          <Field label="Confirm Password" error={errors.confirmPassword}>
            <div style={{ position: "relative" }}>
              <input
                className="reg-input"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                style={inputStyle(errors.confirmPassword, { paddingRight: 48 })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position:  "absolute", right: 12, top: "50%",
                  transform: "translateY(-50%)",
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

          {/* Send OTP button */}
          {!showOTP && (
            <SendOTPBtn loading={loading} />
          )}
        </form>

        {/* ── OTP Section ── */}
        {showOTP && (
          <div style={{
            marginTop:    16,
            background:   "#0d0d10",
            border:       `1px solid ${T.border}`,
            borderRadius: 0,
            padding:      "16px 20px",
          }}>
            <h2 style={{
              fontFamily:   "system-ui, sans-serif",
              fontSize:     14,
              fontWeight:   800,
              color:        T.gold,
              letterSpacing:"-0.01em",
              textAlign:    "center",
              margin:       "0 0 10px",
            }}>
              Verify OTP
            </h2>
            <input
              className="reg-input"
              type="text"
              placeholder="Enter OTP sent to your email"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              style={{ ...inputStyle(false), textAlign: "center", letterSpacing: "0.18em", fontSize: 15, fontWeight: 700 }}
            />
            <VerifyOTPBtn loading={loading} onClick={verifyOTP} />
          </div>
        )}

        {/* ── Divider ── */}
        <div style={{ borderTop: `1px solid ${T.border}`, margin: "22px 0 16px" }} />

        {/* ── Footer ── */}
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 12, color: T.muted, textAlign: "center", margin: 0 }}>
          Already have an account?&nbsp;
          <Link
            to="/login"
            style={{ color: T.gold, fontWeight: 700, textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

/* ─── Send OTP Button ────────────────────────────────────────────────────── */
const SendOTPBtn = ({ loading }) => {
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
      {loading ? <ButtonLoader label="Sending OTP..." /> : "Send OTP"}
    </button>
  );
};

/* ─── Verify OTP Button ──────────────────────────────────────────────────── */
const VerifyOTPBtn = ({ loading, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:         "100%",
        marginTop:     12,
        background:    hov ? "#0da070" : "#10b981",
        border:        "none",
        borderRadius:  0,
        padding:       "11px 0",
        fontFamily:    "system-ui, sans-serif",
        fontSize:      10,
        fontWeight:    800,
        textTransform: "uppercase",
        letterSpacing: "0.10em",
        color:         "#fff",
        cursor:        loading ? "not-allowed" : "pointer",
        opacity:       loading ? 0.7 : 1,
        transition:    "all 0.18s ease",
      }}
    >
      {loading ? <ButtonLoader label="Verifying..." /> : "Verify & Create Account"}
    </button>
  );
};

export default Register;