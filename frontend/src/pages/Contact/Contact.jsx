import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Phone, Send, MessageSquare, Headphones } from "lucide-react";
import toast from "react-hot-toast";
import ButtonLoader from "../../components/loaders/ButtonLoader";
import { fetchSettings } from "../../store/slices/cmsSlice";
import companyData from "../../data/companyData";

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const T = {
  bg:     "#0a0a0b",
  card:   "#111114",
  input:  "#0d0d10",
  hover:  "#16161a",
  border: "#222228",
  gold:   "#c8860a",
  text:   "#f0ede8",
  muted:  "#DCDCDC",
  dim:    "#44424a",
};

const s = {
  label: {
    fontFamily:    "system-ui, sans-serif",
    fontSize:      9,
    fontWeight:    700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color:         T.muted,
    display:       "block",
    marginBottom:  6,
  },
};

/* ─── Shared input style ─────────────────────────────────────────────────── */
const inputBase = {
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
  transition:   "border-color 0.18s ease, box-shadow 0.18s ease",
};

/* ─── Contact Info Card ──────────────────────────────────────────────────── */
const InfoCard = ({ icon: Icon, title, val, desc }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:    T.card,
        border:        `1px solid ${hov ? "#333339" : T.border}`,
        borderRadius:  0,
        padding:       "16px 20px",
        display:       "flex",
        alignItems:    "flex-start",
        gap:           14,
        transition:    "all 0.18s ease",
      }}
    >
      {/* Icon box */}
      <div style={{
        width:          36,
        height:         36,
        background:     "#0d0d10",
        border:         `1px solid ${T.border}`,
        borderRadius:   0,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        flexShrink:     0,
      }}>
        <Icon size={15} color={T.gold} strokeWidth={1.75} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ ...s.label, marginBottom: 2, fontSize: 8 }}>{title}</span>
        <span style={{
          fontFamily:   "system-ui, sans-serif",
          fontSize:     13,
          fontWeight:   700,
          color:        T.text,
          lineHeight:   1.4,
          wordBreak:    "break-word",
        }}>
          {val}
        </span>
        <span style={{
          fontFamily: "system-ui, sans-serif",
          fontSize:   11,
          color:      T.dim,
          lineHeight: 1.4,
        }}>
          {desc}
        </span>
      </div>
    </div>
  );
};

/* ─── Submit Button ──────────────────────────────────────────────────────── */
const SubmitBtn = ({ submitting }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="submit"
      disabled={submitting}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:         "100%",
        background:    submitting ? "#9a6608" : hov ? "#b07808" : T.gold,
        border:        "none",
        borderRadius:  0,
        padding:       "11px 0",
        fontFamily:    "system-ui, sans-serif",
        fontSize:      10,
        fontWeight:    800,
        textTransform: "uppercase",
        letterSpacing: "0.10em",
        color:         "#000",
        cursor:        submitting ? "not-allowed" : "pointer",
        opacity:       submitting ? 0.7 : 1,
        transition:    "all 0.18s ease",
        display:       "flex",
        alignItems:    "center",
        justifyContent:"center",
        gap:           7,
      }}
    >
      {submitting ? <ButtonLoader label="Sending..." /> : (<><Send size={12} strokeWidth={2.5} /> Send Message</>)}
    </button>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
const Contact = () => {
  const dispatch = useDispatch();
  const { settings } = useSelector((state) => state.cms);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you for contacting us! We'll reply shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    { icon: Mail,   title: "Email Us",    val: settings?.supportEmail || companyData.email || "hello@bookworld.site", desc: "For general queries & support" },
    { icon: Phone,  title: "Call Us",     val: settings?.supportPhone || companyData.phone || "+92 300 0000000",        desc: "Mon – Sat (9:00 AM – 6:00 PM)" },
  ];

  const focusCss = `
    .ct-input:focus { border-color: ${T.gold} !important; box-shadow: 0 0 0 2px rgba(200,134,10,0.12); }
    .ct-input::placeholder { color: ${T.dim}; }
    @media (max-width: 768px) {
      .ct-grid { grid-template-columns: 1fr !important; }
      .ct-form-grid { grid-template-columns: 1fr !important; }
    }
  `;

  return (
    <div style={{ background: T.bg, fontFamily: "system-ui, sans-serif", paddingBottom: 48 }}>
      <style>{focusCss}</style>

      {/* ── Page Header — cart-header eyebrow style ── */}
      <div style={{ paddingBottom: 28, borderBottom: `1px solid ${T.border}`, marginBottom: 28 }}>
        {/* Eyebrow */}
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: T.gold,
          marginBottom: 10, fontFamily: "system-ui, sans-serif",
        }}>
          <Headphones size={11} color={T.gold} strokeWidth={2} />
          Get In Touch
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
          Contact Our Team
        </h1>
        {/* Subtitle */}
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: T.muted, margin: 0 }}>
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      {/* ── Main grid: info + form ── */}
      <div
        className="ct-grid"
        style={{
          display:             "grid",
          gridTemplateColumns: "1fr 2fr",
          gap:                 1,
          alignItems:          "start",
        }}
      >
        {/* ── Left: contact info ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {contactInfo.map((item, i) => (
            <InfoCard key={i} {...item} />
          ))}
        </div>

        {/* ── Right: form panel ── */}
        <div style={{
          background:    T.card,
          border:        `1px solid ${T.border}`,
          borderRadius:  0,
          padding:       "28px 32px",
        }}>
          {/* Form header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${T.border}` }}>
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
              <MessageSquare size={14} color={T.gold} strokeWidth={1.75} />
            </div>
            <h2 style={{
              fontFamily:   "system-ui, sans-serif",
              fontSize:     14,
              fontWeight:   800,
              color:        T.text,
              letterSpacing:"-0.01em",
              margin:       0,
            }}>
              Send a Message
            </h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Name + Email row */}
            <div
              className="ct-form-grid"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
            >
              <div>
                <label style={s.label}>Your Name</label>
                <input
                  className="ct-input"
                  type="text" required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  style={inputBase}
                />
              </div>
              <div>
                <label style={s.label}>Email Address</label>
                <input
                  className="ct-input"
                  type="email" required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                  style={inputBase}
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label style={s.label}>Subject</label>
              <input
                className="ct-input"
                type="text" required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Question about order shipment"
                style={inputBase}
              />
            </div>

            {/* Message */}
            <div>
              <label style={s.label}>Message</label>
              <textarea
                className="ct-input"
                rows={5} required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your query details here…"
                style={{ ...inputBase, resize: "none", lineHeight: 1.6 }}
              />
            </div>

            <SubmitBtn submitting={submitting} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;