import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, User, Mail, Phone, FileText, Send, Loader2 } from "lucide-react";
import { useRequestBook } from "../../context/RequestBookContext";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import ButtonLoader from "../loaders/ButtonLoader";

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
};
const font = "system-ui, sans-serif";

/* ─── Injected CSS ────────────────────────────────────────────────────────── */
const css = `
  .rbm-input, .rbm-textarea {
    width: 100%;
    box-sizing: border-box;
    background: ${T.input};
    border: 1px solid ${T.border};
    border-radius: 0;
    padding: 9px 12px 9px 34px;
    font-family: ${font};
    font-size: 12px;
    color: ${T.text};
    outline: none;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
    caret-color: ${T.gold};
  }
  .rbm-textarea {
    padding: 9px 12px 9px 34px;
    resize: none;
  }
  .rbm-input:focus, .rbm-textarea:focus {
    border-color: ${T.gold};
    box-shadow: 0 0 0 2px rgba(200,134,10,0.12);
  }
  .rbm-input::placeholder, .rbm-textarea::placeholder {
    color: ${T.dim};
  }

  .rbm-scroll {
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: ${T.border} transparent;
  }
  .rbm-scroll::-webkit-scrollbar       { width: 3px; }
  .rbm-scroll::-webkit-scrollbar-track { background: transparent; }
  .rbm-scroll::-webkit-scrollbar-thumb { background: ${T.border}; }
  .rbm-scroll::-webkit-scrollbar-thumb:hover { background: ${T.gold}; }

  .rbm-btn-cancel {
    flex: 1;
    background: none;
    border: 1px solid ${T.border};
    border-radius: 0;
    padding: 10px 0;
    font-family: ${font};
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: ${T.muted};
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .rbm-btn-cancel:hover {
    border-color: ${T.text};
    color: ${T.text};
  }
  .rbm-btn-submit {
    flex: 2;
    background: ${T.gold};
    border: 1px solid ${T.gold};
    border-radius: 0;
    padding: 10px 0;
    font-family: ${font};
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: #000;
    cursor: pointer;
    transition: background 0.18s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .rbm-btn-submit:hover:not(:disabled)  { background: #b07808; }
  .rbm-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  .rbm-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  @media (max-width: 480px) {
    .rbm-grid-2 { grid-template-columns: 1fr; }
  }
`;

/* ─── Field wrapper ───────────────────────────────────────────────────────── */
const Field = ({ label, required, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    <label style={{
      fontFamily:    font,
      fontSize:      9,
      fontWeight:    700,
      letterSpacing: "0.10em",
      textTransform: "uppercase",
      color:         T.muted,
      display:       "flex",
      alignItems:    "center",
      gap:           4,
    }}>
      {label}
      {required && <span style={{ color: T.danger, fontSize: 10, lineHeight: 1 }}>*</span>}
    </label>
    {children}
  </div>
);

/* ─── Input with icon ─────────────────────────────────────────────────────── */
const IconInput = ({ icon: Icon, textarea, rows, ...props }) => (
  <div style={{ position: "relative" }}>
    <span style={{
      position:      "absolute",
      left:          11,
      top:           textarea ? 10 : "50%",
      transform:     textarea ? "none" : "translateY(-50%)",
      color:         T.dim,
      display:       "flex",
      alignItems:    "center",
      pointerEvents: "none",
    }}>
      <Icon size={12} strokeWidth={2} />
    </span>
    {textarea
      ? <textarea className="rbm-textarea" rows={rows || 3} {...props} />
      : <input    className="rbm-input"                        {...props} />
    }
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────────── */
const RequestBookModal = () => {
  const { isOpen, closeRequestModal } = useRequestBook();
  const reduxUser = useSelector((state) => state.auth.user);
  const user = reduxUser || JSON.parse(localStorage.getItem("user") || "null");

  const [title,   setTitle]   = useState("");
  const [author,  setAuthor]  = useState("");
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [phone,   setPhone]   = useState("");
  const [notes,   setNotes]   = useState("");
  const [loading, setLoading] = useState(false);

  /* Prefill user details when modal opens */
  useEffect(() => {
    if (isOpen) {
      setName(user?.name  || "");
      setEmail(user?.email || "");
      setPhone(user?.phone || "");
      setTitle("");
      setAuthor("");
      setNotes("");
    }
  }, [isOpen, reduxUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !name.trim() || !email.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      setLoading(true);
      const res = await axiosInstance.post("/requests", { title, author, name, email, phone, notes });
      if (res.data.success) {
        toast.success(res.data.message || "Book request submitted successfully!");
        closeRequestModal();
      } else {
        toast.error(res.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Book Request Error:", error);
      toast.error(error.response?.data?.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <style>{css}</style>

          {/* ── Overlay ── */}
          <div
            style={{
              position:        "fixed",
              left:            0, right: 0,
              top:             110, bottom: 56,
              zIndex:          30,
              background:      "rgba(0,0,0,0.72)",
              backdropFilter:  "blur(2px)",
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              padding:         "16px",
            }}
            onClick={closeRequestModal}
          >
            {/* ── Modal container ── */}
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0,   opacity: 1 }}
              exit={{    y: -40, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width:        "100%",
                maxWidth:     640,
                background:   T.card,
                border:       `1px solid ${T.border}`,
                borderRadius: 0,
                boxShadow:    "0 8px 40px rgba(0,0,0,0.55)",
                display:      "flex",
                flexDirection:"column",
                overflow:     "hidden",
                fontFamily:   font,
              }}
            >
              {/* ── Header ── */}
              <div style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
                padding:        "13px 20px",
                borderBottom:   `1px solid ${T.border}`,
                background:     "#0d0d10",
                flexShrink:     0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Icon box */}
                  <div style={{
                    width:          34,
                    height:         34,
                    flexShrink:     0,
                    background:     "rgba(200,134,10,0.08)",
                    border:         `1px solid rgba(200,134,10,0.3)`,
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    color:          T.gold,
                  }}>
                    <BookOpen size={15} strokeWidth={2} />
                  </div>

                  <div>
                    <h3 style={{
                      fontFamily:    font,
                      fontSize:      16,
                      fontWeight:    800,
                      color:         T.text,
                      lineHeight:    1.2,
                      letterSpacing: "-0.01em",
                      margin:        0,
                    }}>
                      Request a Book
                    </h3>
                    <p style={{ fontFamily: font, fontSize: 10, color: T.muted, margin: "2px 0 0" }}>
                      Can't find a title? We'll source it for you.
                    </p>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={closeRequestModal}
                  style={{
                    background:  T.card,
                    border:      `1px solid ${T.border}`,
                    borderRadius: 0,
                    padding:     "5px 7px",
                    cursor:      "pointer",
                    color:       T.muted,
                    display:     "flex",
                    alignItems:  "center",
                    transition:  "all 0.18s ease",
                    flexShrink:  0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.color = T.gold; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
                  aria-label="Close modal"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </div>

              {/* ── Form ── */}
              <form
                onSubmit={handleSubmit}
                className="rbm-scroll"
                style={{
                  padding:   "20px",
                  display:   "flex",
                  flexDirection: "column",
                  gap:       12,
                  maxHeight: "calc(70vh - 100px)",
                }}
              >
                {/* Book Title & Author */}
                <div className="rbm-grid-2">
                  <Field label="Book Title" required>
                    <IconInput
                      icon={BookOpen}
                      type="text"
                      placeholder="e.g. Clean Code"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Book Author" required>
                    <IconInput
                      icon={User}
                      type="text"
                      placeholder="e.g. Robert C. Martin"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      required
                    />
                  </Field>
                </div>

                {/* Your Name */}
                <Field label="Your Name" required>
                  <IconInput
                    icon={User}
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Field>

                {/* Email & Phone */}
                <div className="rbm-grid-2">
                  <Field label="Email Address" required>
                    <IconInput
                      icon={Mail}
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Phone Number">
                    <IconInput
                      icon={Phone}
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Field>
                </div>

                {/* Notes */}
                <Field label="Additional Notes / Special Instructions">
                  <IconInput
                    icon={FileText}
                    textarea
                    rows={3}
                    placeholder="Binding preference, edition, max price you're willing to pay…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Field>

                {/* Divider */}
                <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 4 }} />

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="rbm-btn-cancel"
                    onClick={closeRequestModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rbm-btn-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <ButtonLoader label="Submitting..." />
                    ) : (
                      <>
                        <Send size={12} strokeWidth={2} />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Loader spin keyframe */}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}
    </AnimatePresence>
  );
};

export default RequestBookModal;