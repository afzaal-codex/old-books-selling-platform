import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, User, Mail, Heart, MessageSquare, Send, Loader2 } from "lucide-react";
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
  muted:   "#DCDCDC",
  dim:     "#44424a",
  danger:  "#ef4444",
};
const font = "system-ui, sans-serif";

/* ─── Injected CSS ────────────────────────────────────────────────────────── */
const css = `
  .sgm-input, .sgm-textarea {
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
  .sgm-textarea {
    padding: 9px 12px 9px 34px;
    resize: none;
  }
  .sgm-input:focus, .sgm-textarea:focus {
    border-color: ${T.gold};
    box-shadow: 0 0 0 2px rgba(200,134,10,0.12);
  }
  .sgm-input::placeholder, .sgm-textarea::placeholder {
    color: ${T.dim};
  }

  .sgm-scroll {
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: ${T.border} transparent;
  }
  .sgm-scroll::-webkit-scrollbar       { width: 3px; }
  .sgm-scroll::-webkit-scrollbar-track { background: transparent; }
  .sgm-scroll::-webkit-scrollbar-thumb { background: ${T.border}; }
  .sgm-scroll::-webkit-scrollbar-thumb:hover { background: ${T.gold}; }

  .sgm-btn-cancel {
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
  .sgm-btn-cancel:hover {
    border-color: ${T.text};
    color: ${T.text};
  }
  .sgm-btn-submit {
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
  .sgm-btn-submit:hover:not(:disabled) { background: #b07808; }
  .sgm-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  .sgm-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  @media (max-width: 480px) {
    .sgm-grid-2 { grid-template-columns: 1fr; }
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
      ? <textarea className="sgm-textarea" rows={rows || 3} {...props} />
      : <input    className="sgm-input"                        {...props} />
    }
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────────── */
const SendGiftModal = ({ isOpen, onClose }) => {
  const reduxUser = useSelector((state) => state.auth.user);
  const user = reduxUser || JSON.parse(localStorage.getItem("user") || "null");

  const [recipientName,  setRecipientName]  = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName,     setSenderName]     = useState("");
  const [message,        setMessage]        = useState("");
  const [amount,         setAmount]         = useState("");
  const [loading,        setLoading]        = useState(false);

  /* Prefill sender from logged-in user */
  useEffect(() => {
    if (isOpen) {
      setSenderName(user?.name || "");
      setRecipientName("");
      setRecipientEmail("");
      setMessage("");
      setAmount("");
    }
  }, [isOpen, reduxUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientEmail.trim() || !senderName.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      setLoading(true);
      /* POST to /requests endpoint with a gift type flag — the backend stores it like any request */
      await axiosInstance.post("/requests", {
        title:  `Gift Card — From: ${senderName}`,
        author: `Recipient: ${recipientName} <${recipientEmail}>`,
        name:   senderName,
        email:  user?.email || recipientEmail,
        phone:  "",
        notes:  `🎁 Gift Card Request\nTo: ${recipientName} (${recipientEmail})\nFrom: ${senderName}\nAmount: ${amount ? `Rs. ${amount}` : "Not specified"}\nMessage: ${message || "No message"}`,
      });
      toast.success("Gift card request sent successfully!");
      onClose();
    } catch (error) {
      console.error("Send Gift Error:", error);
      toast.error(error.response?.data?.message || "Failed to send gift card request.");
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
            onClick={onClose}
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
                    <Gift size={15} strokeWidth={2} />
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
                      Send a Gift Card
                    </h3>
                    <p style={{ fontFamily: font, fontSize: 10, color: T.muted, margin: "2px 0 0" }}>
                      Surprise someone with the gift of reading.
                    </p>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
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
                className="sgm-scroll"
                style={{
                  padding:   "20px",
                  display:   "flex",
                  flexDirection: "column",
                  gap:       12,
                  maxHeight: "calc(70vh - 100px)",
                }}
              >
                {/* Recipient Name & Email */}
                <div className="sgm-grid-2">
                  <Field label="Recipient Name" required>
                    <IconInput
                      icon={User}
                      type="text"
                      placeholder="e.g. Ahmad Raza"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                    />
                  </Field>
                  <Field label="Recipient Email" required>
                    <IconInput
                      icon={Mail}
                      type="email"
                      placeholder="recipient@example.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      required
                    />
                  </Field>
                </div>

                {/* Sender Name */}
                <Field label="Sender Name" required>
                  <IconInput
                    icon={Heart}
                    type="text"
                    placeholder="Your name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    required
                  />
                </Field>

                {/* Gift Amount */}
                <Field label="Gift Amount (Rs.)">
                  <IconInput
                    icon={Gift}
                    type="number"
                    placeholder="e.g. 500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={0}
                  />
                </Field>

                {/* Gift Message */}
                <Field label="Personal Message">
                  <IconInput
                    icon={MessageSquare}
                    textarea
                    rows={3}
                    placeholder="Write a warm message for the recipient…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Field>

                {/* Divider */}
                <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 4 }} />

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className="sgm-btn-cancel"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="sgm-btn-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <ButtonLoader label="Sending..." />
                    ) : (
                      <>
                        <Send size={12} strokeWidth={2} />
                        Send Gift Card
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Loader spin keyframe */}
          <style>{`@keyframes sgm-spin { to { transform: rotate(360deg); } }`}</style>
        </>
      )}
    </AnimatePresence>
  );
};

export default SendGiftModal;
