import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setAuth } from "../../store/slices/authSlice";
import axiosInstance from "../../utils/axiosInstance";
import ButtonLoader from "../../components/loaders/ButtonLoader";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import SeoHead from "../../components/common/SeoHead";

/* ─── Design tokens (same as Register) ───────────────────────────────────── */
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

/* ─── Input style helper ─────────────────────────────────────────────────── */
const inputStyle = (hasError, extraStyle = {}) => ({
  width:        "100%",
  boxSizing:    "border-box",
  background:   T.input,
  border:       `1px solid ${hasError ? T.danger : T.border}`,
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
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { settings } = useSelector((state) => state.cms);
  const loginContent = settings?.loginContent || {};

  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors,       setErrors]       = useState({});
  const [formData,     setFormData]     = useState({
    email: "", password: "", rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev)   => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email    = "Email is required";
    if (!formData.password)     newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Email and password are required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/login", {
        email:    formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      const data = response.data;
      dispatch(setAuth({ token: data.token, user: data.user, isAdmin: data.isAdmin }));
      toast.success(data.message);
      const redirectPath = location.state?.from?.pathname || "/";
      if (data.isAdmin) navigate("/admin"); else navigate(redirectPath);
    } catch (error) {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
      if (message === "User not found")                  setErrors({ email: message });
      if (message === "Invalid email or password")       setErrors({ password: message });
      if (message === "Your account has been blocked")   setErrors({ email: message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axiosInstance.post("/auth/google", {
        token: credentialResponse.credential,
      });
      const data = response.data;
      dispatch(setAuth({ token: data.token, user: data.user, isAdmin: data.isAdmin }));
      toast.success(data.message);
      if (data.isAdmin) navigate("/admin"); else navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
    }
  };

  const focusCss = `
    .login-input:focus { border-color: ${T.gold} !important; }
    .login-input::placeholder { color: ${T.dim}; }
    @media (max-width: 600px) {
      .login-card { padding: 24px 20px !important; }
    }
  `;

  return (
      <SeoHead page="Login" />
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
        className="login-card"
        style={{
          width:      "100%",
          maxWidth:   520,
          background: T.card,
          border:     `1px solid ${T.border}`,
          borderRadius: 0,
          padding:    "36px 40px 28px",
          boxShadow:  "0 8px 40px rgba(0,0,0,0.5)",
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
            {loginContent.eyebrow || "Bookstore Account"}
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
            {loginContent.title || "Welcome Back"}
          </h1>
          <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: T.muted, margin: 0 }}>
            {loginContent.subtitle || "Login to continue your reading journey"}
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Email */}
          <Field label="Email Address" error={errors.email}>
            <input
              className="login-input"
              type="email" name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={inputStyle(errors.email)}
            />
          </Field>

          {/* Password */}
          <Field label="Password" error={errors.password}>
            <div style={{ position: "relative" }}>
              <input
                className="login-input"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
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
                {showPassword
                  ? <EyeOff size={14} strokeWidth={2} />
                  : <Eye    size={14} strokeWidth={2} />}
              </button>
            </div>
          </Field>

          {/* Remember Me + Forgot Password */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{
              display:    "flex",
              alignItems: "center",
              gap:        6,
              fontSize:   11,
              color:      T.muted,
              cursor:     "pointer",
              userSelect: "none",
            }}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                style={{ accentColor: T.gold, cursor: "pointer" }}
              />
              Remember Me
            </label>

            <Link
              to="/forgot-password"
              style={{ fontSize: 11, fontWeight: 600, color: T.gold, textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <LoginBtn loading={loading} />
        </form>

        {/* ── Divider ── */}
        <div style={{ position: "relative", padding: "18px 0" }}>
          <div style={{ borderTop: `1px solid ${T.border}` }} />
          <div style={{
            position:       "absolute",
            top:            "50%",
            left:           "50%",
            transform:      "translate(-50%, -50%)",
            background:     T.card,
            padding:        "0 12px",
          }}>
            <span style={{ fontSize: 10, color: T.muted, letterSpacing: "0.10em", textTransform: "uppercase" }}>
              or
            </span>
          </div>
        </div>

        {/* ── Google Login ── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google Login Failed")}
          />
        </div>

        {/* ── Divider ── */}
        <div style={{ borderTop: `1px solid ${T.border}`, margin: "22px 0 16px" }} />

        {/* ── Footer ── */}
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 12, color: T.muted, textAlign: "center", margin: 0 }}>
          Don&apos;t have an account?&nbsp;
          <Link
            to="/signup"
            style={{ color: T.gold, fontWeight: 700, textDecoration: "none" }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
            onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

/* ─── Login Button ───────────────────────────────────────────────────────── */
const LoginBtn = ({ loading }) => {
  const [hov, setHov] = useState(false);
  return (
      <SeoHead page="Login" />
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
      {loading ? <ButtonLoader label="Logging in..." /> : "Login"}
    </button>
  );
};

export default Login;
