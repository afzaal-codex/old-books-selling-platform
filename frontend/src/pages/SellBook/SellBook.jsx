import { useState } from "react";
import { BookOpen, User, Mail, Phone, Tag, DollarSign, Send, Landmark } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import ButtonLoader from "../../components/loaders/ButtonLoader";

/* ─── Design tokens ─── */
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

const inputBase = {
  width:        "100%",
  boxSizing:    "border-box",
  background:   T.input,
  border:       `1px solid ${T.border}`,
  borderRadius: 0,
  padding:      "10px 14px 10px 34px",
  fontFamily:   "system-ui, sans-serif",
  fontSize:     13,
  color:        T.text,
  outline:      "none",
  transition:   "border-color 0.18s ease, box-shadow 0.18s ease",
};

const SellBook = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    author: "",
    condition: "Good",
    binding: "Hardcover",
    price: "",
    quantity: 1,
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: formData.title,
      author: formData.author,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      notes: `SELL OFFER: [Condition: ${formData.condition} | Binding: ${formData.binding} | Quantity: ${formData.quantity} | Price Request: Rs. ${formData.price}] Description: ${formData.message}`,
    };

    try {
      await axiosInstance.post("/requests", payload);
      toast.success("Book offer submitted successfully! Our team will contact you shortly.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        title: "",
        author: "",
        condition: "Good",
        binding: "Hardcover",
        price: "",
        quantity: 1,
        message: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  };

  const focusCss = `
    .sb-input:focus { border-color: ${T.gold} !important; box-shadow: 0 0 0 2px rgba(200,134,10,0.12); }
    .sb-input::placeholder { color: ${T.dim}; }
    @media (max-width: 768px) {
      .sb-grid { grid-template-columns: 1fr !important; }
      .sb-form-grid { grid-template-columns: 1fr !important; }
    }
  `;

  return (
    <div style={{ background: T.bg, fontFamily: "system-ui, sans-serif", paddingBottom: 48 }}>
      <style>{focusCss}</style>

      {/* Page Header */}
      <div style={{ paddingBottom: 28, borderBottom: `1px solid ${T.border}`, marginBottom: 28 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: T.gold,
          marginBottom: 10,
        }}>
          <Landmark size={11} color={T.gold} strokeWidth={2} />
          Earn From Your Shelves
        </div>
        <h1 style={{
          fontFamily:   "system-ui, sans-serif",
          fontSize:     "clamp(26px, 4vw, 36px)",
          fontWeight:   800,
          color:        T.text,
          lineHeight:   1.15,
          margin:       "0 0 6px",
          letterSpacing:"-0.01em",
        }}>
          Sell Your Rare Books
        </h1>
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: T.muted, margin: 0 }}>
          Submit details of the books you want to sell. We buy rare volumes, vintage copies, and classic libraries.
        </p>
      </div>

      {/* Form Container */}
      <div className="sb-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
        <div style={{
          background:    T.card,
          border:        `1px solid ${T.border}`,
          borderRadius:  0,
          padding:       "28px 32px",
        }}>
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
              <BookOpen size={14} color={T.gold} strokeWidth={1.75} />
            </div>
            <h2 style={{
              fontFamily:   "system-ui, sans-serif",
              fontSize:     14,
              fontWeight:   800,
              color:        T.text,
              letterSpacing:"-0.01em",
              margin:       0,
            }}>
              Book Details Form
            </h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Customer Details Row */}
            <div className="sb-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div>
                <label style={s.label}>Your Name *</label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    className="sb-input"
                    type="text" required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Doe"
                    style={inputBase}
                  />
                </div>
              </div>
              <div>
                <label style={s.label}>Email Address *</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    className="sb-input"
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. john@example.com"
                    style={inputBase}
                  />
                </div>
              </div>
              <div>
                <label style={s.label}>Phone Number</label>
                <div className="relative">
                  <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    className="sb-input"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 03001234567"
                    style={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* Book Details Row */}
            <div className="sb-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={s.label}>Book Title *</label>
                <div className="relative">
                  <BookOpen size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    className="sb-input"
                    type="text" required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Letters from the Meridian"
                    style={inputBase}
                  />
                </div>
              </div>
              <div>
                <label style={s.label}>Book Author *</label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    className="sb-input"
                    type="text" required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="e.g. Nikolai Brennan"
                    style={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* Selling Parameters Row */}
            <div className="sb-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
              <div>
                <label style={s.label}>Book Condition *</label>
                <div className="relative">
                  <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select
                    className="sb-input cursor-pointer"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    style={{ ...inputBase, paddingLeft: "34px", background: T.input }}
                  >
                    <option value="New">New / Mint</option>
                    <option value="Good">Good / Readable</option>
                    <option value="Fair">Fair / Worn</option>
                    <option value="Poor">Poor / Damaged</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={s.label}>Page Binding *</label>
                <div className="relative">
                  <BookOpen size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select
                    className="sb-input cursor-pointer"
                    value={formData.binding}
                    onChange={(e) => setFormData({ ...formData, binding: e.target.value })}
                    style={{ ...inputBase, paddingLeft: "34px", background: T.input }}
                  >
                    <option value="Hardcover">Hardcover</option>
                    <option value="Paperback">Paperback</option>
                    <option value="Leatherbound">Leatherbound</option>
                    <option value="Spiral">Spiral</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={s.label}>Expected Price (Rs.) *</label>
                <div className="relative">
                  <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    className="sb-input"
                    type="number" required min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 500"
                    style={inputBase}
                  />
                </div>
              </div>

              <div>
                <label style={s.label}>Quantity *</label>
                <div className="relative">
                  <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    className="sb-input"
                    type="number" required min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    placeholder="e.g. 1"
                    style={inputBase}
                  />
                </div>
              </div>
            </div>

            {/* Message/Description */}
            <div>
              <label style={s.label}>Description & Edition Details</label>
              <textarea
                className="sb-input"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mention any cover stains, highlighting, page markings, edition/year, or special bindings..."
                style={{ ...inputBase, resize: "none", lineHeight: 1.6, paddingLeft: "14px" }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="sb-btn flex items-center justify-center gap-2"
              style={{
                width:         "100%",
                background:    submitting ? "#9a6608" : T.gold,
                border:        "none",
                borderRadius:  0,
                padding:       "12px 0",
                fontFamily:    "system-ui, sans-serif",
                fontSize:      10,
                fontWeight:    800,
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                color:         "#000",
                cursor:        submitting ? "not-allowed" : "pointer",
                transition:    "opacity 0.2s, background 0.18s ease",
              }}
            >
              {submitting ? (
                <ButtonLoader />
              ) : (
                <>
                  <Send size={12} strokeWidth={2.5} />
                  Submit Selling Offer
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellBook;
