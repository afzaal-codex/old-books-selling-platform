import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createOrderAction, resetOrderState } from "../../store/slices/orderSlice";
import { submitPayment } from "../../store/slices/paymentSlice";
import { clearCart, setDeliveryCharges, clearDirectCheckoutItem } from "../../store/slices/cartSlice";
import { fetchSettings } from "../../store/slices/cmsSlice";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { CreditCard, Truck, AlertTriangle, ArrowLeft, ShieldCheck } from "lucide-react";
import ButtonLoader from "../../components/loaders/ButtonLoader";

/* ─── Back Button ────────────────────────────────────────────────────────── */
const BackBtn = () => {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to="/cart"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display:       "inline-flex",
        alignItems:    "center",
        gap:           6,
        fontFamily:    "system-ui, sans-serif",
        fontSize:      9,
        fontWeight:    700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color:         hov ? "var(--co-primary)" : "#ffffff",
        background:    "#0d0d10",
        border:        `1px solid ${hov ? "var(--co-primary)" : "var(--co-border)"}`,
        borderRadius:  0,
        padding:       "6px 12px",
        textDecoration:"none",
        transition:    "all 0.18s ease",
        marginBottom:  "12px",
      }}
    >
      <ArrowLeft size={11} strokeWidth={2.5} />
      Back to Cart
    </Link>
  );
};

/* ─────────────────────────────────────────────
   DESIGN TOKENS — mirrors Cart.jsx exactly
───────────────────────────────────────────── */
const styles = `
  :root {
    --co-bg:          #0a0a0b;
    --co-card:        #111114;
    --co-card-hover:  #16161a;
    --co-border:      #222228;
    --co-primary:     #c8860a;
    --co-primary-dim: rgba(200,134,10,0.10);
    --co-text:        #f0ede8;
    --co-muted:       #6b6870;
    --co-muted-2:     #44424a;
    --co-success:     #10b981;
    --co-success-dim: rgba(16,185,129,0.10);
    --co-danger:      #ef4444;
    --co-input-bg:    #0d0d10;
    --co-font:        system-ui, sans-serif;
    --co-shadow:      0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px var(--co-border);
    --co-trans:       all 0.18s ease;
  }

  .co * { box-sizing: border-box; }
  .co {
    font-family: var(--co-font);
    background: var(--co-bg);
    color: var(--co-text);
    padding-bottom: 64px;
  }

  /* ── Page Header ── */
  .co-header {
    display: flex; align-items: flex-start; gap: 12px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--co-border);
    margin-bottom: 28px;
  }
  .co-back-btn {
    display: flex; align-items: center; justify-content: center;
    width: 34px; height: 34px; flex-shrink: 0;
    background: var(--co-card); border: 1px solid var(--co-border);
    border-radius: 0; cursor: pointer; color: var(--co-muted);
    transition: var(--co-trans);
  }
  .co-back-btn:hover { border-color: var(--co-primary); color: var(--co-text); }
  .co-header__eyebrow {
    display: flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 700; letter-spacing: .13em;
    text-transform: uppercase; color: var(--co-primary); margin-bottom: 6px;
  }
  .co-header__title {
    font-size: clamp(22px, 3.5vw, 30px); font-weight: 800;
    letter-spacing: -0.01em; line-height: 1.15;
    color: var(--co-text); margin: 0 0 4px;
  }
  .co-header__sub { font-size: 12px; color: var(--co-muted); margin: 0; }

  /* ── Main Grid ── */
  .co-grid { display: grid; gap: 24px; }
  @media (min-width: 1024px) {
    .co-grid { grid-template-columns: 1fr 360px; align-items: start; }
    .co-main-col { min-height: 0; }
    .co-sidebar-col { position: sticky; top: 118px; align-self: start; }
  }

  /* ── Section Card ── */
  .co-section {
    background: var(--co-card);
    border: 1px solid var(--co-border);
    border-radius: 0;
    box-shadow: var(--co-shadow);
    margin-bottom: 16px;
  }
  .co-section__head {
    display: flex; align-items: center; gap: 8px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--co-border);
  }
  .co-section__icon { color: var(--co-primary); display: flex; align-items: center; }
  .co-section__eyebrow {
    font-size: 9px; font-weight: 700; letter-spacing: .13em;
    text-transform: uppercase; color: var(--co-primary); display: block; margin-bottom: 2px;
  }
  .co-section__title {
    font-size: 14px; font-weight: 800; letter-spacing: -0.01em;
    color: var(--co-text); margin: 0;
  }
  .co-section__body { padding: 20px; }

  /* ── Form Grid ── */
  .co-form-grid { display: grid; gap: 14px; }
  @media (min-width: 640px) { .co-form-grid { grid-template-columns: 1fr 1fr; } }
  .co-form-full { grid-column: 1 / -1; }

  /* ── Form Fields ── */
  .co-label {
    display: block; font-size: 9px; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase;
    color: var(--co-primary); margin-bottom: 5px;
  }
  .co-input {
    width: 100%; background: var(--co-input-bg);
    border: 1px solid var(--co-border); border-radius: 0;
    padding: 9px 12px; font-size: 12px;
    font-family: var(--co-font); color: var(--co-text);
    outline: none; transition: var(--co-trans);
  }
  .co-input::placeholder { color: var(--co-muted); }
  .co-input:focus { border-color: var(--co-primary); box-shadow: 0 0 0 2px var(--co-primary-dim); }
  .co-select {
    width: 100%; background: var(--co-input-bg);
    border: 1px solid var(--co-border); border-radius: 0;
    padding: 9px 12px; font-size: 12px;
    font-family: var(--co-font); color: var(--co-text);
    outline: none; cursor: pointer; transition: var(--co-trans);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236b6870' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 30px;
  }
  .co-select:focus { border-color: var(--co-primary); box-shadow: 0 0 0 2px var(--co-primary-dim); }
  .co-select option { background: #111114; }
  .co-textarea {
    width: 100%; background: var(--co-input-bg);
    border: 1px solid var(--co-border); border-radius: 0;
    padding: 9px 12px; font-size: 12px;
    font-family: var(--co-font); color: var(--co-text);
    outline: none; resize: none; transition: var(--co-trans);
    line-height: 1.5;
  }
  .co-textarea::placeholder { color: var(--co-muted); }
  .co-textarea:focus { border-color: var(--co-primary); box-shadow: 0 0 0 2px var(--co-primary-dim); }

  /* ── Checkbox row ── */
  .co-checkbox-row {
    display: flex; align-items: center; gap: 8px;
    padding-top: 12px; border-top: 1px solid var(--co-border); margin-top: 4px;
  }
  .co-checkbox {
    width: 14px; height: 14px; border-radius: 0;
    border: 1px solid var(--co-border);
    background: var(--co-input-bg); cursor: pointer;
    accent-color: var(--co-primary);
  }
  .co-checkbox-label { font-size: 11px; color: var(--co-muted); cursor: pointer; user-select: none; }

  /* ── Payment Method Grid ── */
  .co-pay-grid { display: grid; gap: 8px; grid-template-columns: 1fr 1fr; }
  @media (min-width: 640px) { .co-pay-grid { grid-template-columns: repeat(4, 1fr); } }
  .co-pay-btn {
    padding: 12px 8px; border: 1px solid var(--co-border);
    background: var(--co-input-bg); border-radius: 0;
    font-size: 9.5px; font-weight: 800; text-transform: uppercase;
    letter-spacing: .06em; color: var(--co-muted);
    cursor: pointer; text-align: center; transition: var(--co-trans);
    line-height: 1.4;
  }
  .co-pay-btn:hover { border-color: var(--co-muted-2); color: var(--co-text); }
  .co-pay-btn--active {
    border-color: var(--co-primary);
    background: var(--co-primary-dim);
    color: var(--co-primary);
  }

  /* ── Payment Info Box ── */
  .co-pay-info {
    background: #0d0d10;
    border: 1px solid var(--co-border);
    border-radius: 0;
    padding: 16px 18px;
    margin-top: 14px;
  }
  .co-pay-alert {
    display: flex; align-items: flex-start; gap: 8px;
    background: var(--co-primary-dim);
    border: 1px solid rgba(200,134,10,0.25);
    padding: 10px 12px; margin-bottom: 14px;
  }
  .co-pay-alert__icon { color: var(--co-primary); flex-shrink: 0; margin-top: 1px; }
  .co-pay-alert__text { font-size: 11px; color: var(--co-muted); line-height: 1.55; }
  .co-pay-alert__text strong { color: var(--co-primary); font-weight: 700; }
  .co-account-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--co-muted); margin-bottom: 3px; }
  .co-account-value { font-size: 13px; font-weight: 700; color: var(--co-text); margin-bottom: 10px; }
  .co-account-value--gold { font-size: 15px; font-weight: 800; color: var(--co-primary); letter-spacing: .04em; margin-bottom: 10px; }
  .co-account-divider { height: 1px; background: var(--co-border); margin: 12px 0; }

  /* ── Transaction Fields ── */
  .co-proof-grid { display: grid; gap: 12px; padding-top: 14px; border-top: 1px solid var(--co-border); margin-top: 4px; }
  @media (min-width: 640px) { .co-proof-grid { grid-template-columns: 1fr 1fr; } }
  .co-file-input {
    width: 100%; background: var(--co-input-bg);
    border: 1px solid var(--co-border); border-radius: 0;
    padding: 8px 12px; font-size: 11px;
    font-family: var(--co-font); color: var(--co-muted);
    outline: none; cursor: pointer; transition: var(--co-trans);
  }
  .co-file-input:focus { border-color: var(--co-primary); }
  .co-upload-hint { font-size: 10px; color: var(--co-muted-2); margin-top: 4px; }

  /* ── ORDER SUMMARY SIDEBAR ── */
  .co-summary {
    background: var(--co-card);
    border: 1px solid var(--co-border);
    border-radius: 0;
    box-shadow: var(--co-shadow);
  }
  .co-summary__head {
    padding: 16px 20px;
    border-bottom: 1px solid var(--co-border);
  }
  .co-summary__eyebrow {
    font-size: 9px; font-weight: 700; letter-spacing: .13em;
    text-transform: uppercase; color: var(--co-primary); display: block; margin-bottom: 3px;
  }
  .co-summary__title {
    font-size: 15px; font-weight: 800; letter-spacing: -0.01em; color: var(--co-text); margin: 0;
  }
  .co-summary__body { padding: 16px 20px; }

  /* ── Order Items List ── */
  .co-items-list {
    max-height: 200px; overflow-y: auto;
    scrollbar-width: thin; scrollbar-color: var(--co-border) transparent;
    margin-bottom: 12px;
  }
  .co-order-item {
    display: flex; justify-content: space-between; align-items: flex-start;
    gap: 8px; padding: 8px 0;
    border-bottom: 1px solid var(--co-border);
    font-size: 11.5px;
  }
  .co-order-item:last-child { border-bottom: none; }
  .co-order-item__title { color: var(--co-muted); flex: 1; line-height: 1.4; }
  .co-order-item__qty {
    font-size: 9px; font-weight: 700; color: var(--co-primary);
    background: var(--co-primary-dim);
    padding: 1px 5px; margin-left: 4px; flex-shrink: 0; align-self: flex-start;
  }
  .co-order-item__price { font-weight: 700; color: var(--co-text); white-space: nowrap; flex-shrink: 0; }

  /* ── Totals ── */
  .co-totals { border-top: 1px solid var(--co-border); padding-top: 12px; display: flex; flex-direction: column; gap: 8px; }
  .co-total-row { display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
  .co-total-row__label { color: var(--co-muted); }
  .co-total-row__val { font-weight: 600; color: var(--co-text); }
  .co-total-row--discount .co-total-row__val { color: var(--co-success); }
  .co-grand-total {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 12px; margin-top: 4px;
    border-top: 1px solid var(--co-border);
  }
  .co-grand-total__label { font-size: 13px; font-weight: 700; color: var(--co-text); }
  .co-grand-total__val { font-size: 20px; font-weight: 800; color: var(--co-primary); }

  /* ── Place Order Button ── */
  .co-place-btn {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    background: var(--co-primary); color: #000;
    border: none; border-radius: 0;
    padding: 13px 20px; margin-top: 16px;
    font-size: 10px; font-weight: 800; text-transform: uppercase;
    letter-spacing: .08em; font-family: var(--co-font);
    cursor: pointer; transition: var(--co-trans);
  }
  .co-place-btn:hover:not(:disabled) { background: #a86f08; }
  .co-place-btn:disabled { opacity: .45; cursor: not-allowed; }

  /* ── Security note ── */
  .co-secure-note {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    font-size: 9.5px; color: var(--co-muted-2);
    margin-top: 10px; text-align: center;
  }
`;

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartState = useSelector((state) => state.cart);
  const { deliveryCharges, coupon, directCheckoutItem } = cartState;

  const isDirect = !!directCheckoutItem;
  const cartItems = isDirect ? [directCheckoutItem] : cartState.cartItems;

  let subtotal = 0;
  cartItems.forEach((item) => {
    const price = item.discountedPrice > 0 && item.discountedPrice < item.originalPrice
      ? item.discountedPrice
      : item.originalPrice;
    subtotal += price * item.quantity;
  });

  let couponDiscount = 0;
  if (coupon) {
    const type = coupon.discountType?.toLowerCase();
    if (type === "percentage") {
      couponDiscount = Math.round((subtotal * coupon.discountValue) / 100);
    } else if (type === "fixed") {
      couponDiscount = coupon.discountValue;
    }
  }

  const totalPrice = Math.max(subtotal + deliveryCharges - couponDiscount, 0);
  const { settings } = useSelector((state) => state.cms);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [fullName, setFullName] = useState(() => localStorage.getItem("checkout_fullName") || user?.name || "");
  const [email, setEmail] = useState(() => localStorage.getItem("checkout_email") || user?.email || "");
  const [phone, setPhone] = useState(() => localStorage.getItem("checkout_phone") || user?.phone || "");
  const [city, setCity] = useState(() => localStorage.getItem("checkout_city") || "Karachi");
  const [address, setAddress] = useState(() => localStorage.getItem("checkout_address") || "");
  const [saveShippingInfo, setSaveShippingInfo] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      if (settings.useFlatDeliveryRate) {
        dispatch(setDeliveryCharges(settings.flatDeliveryRate || 150));
      } else if (settings.deliveryCharges) {
        const charges = settings.deliveryCharges;
        const matchingCity = Object.keys(charges).find((c) => c.toLowerCase() === city.toLowerCase());
        dispatch(setDeliveryCharges(matchingCity ? charges[matchingCity] : 150));
      }
    }
  }, [city, settings, dispatch]);

  const handleScreenshotUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("media", file);
      const res = await axiosInstance.post("/reviews/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success && res.data.files?.length > 0) {
        setScreenshot(res.data.files[0].url);
        toast.success("Screenshot uploaded successfully!");
      } else {
        toast.error("Failed to upload screenshot");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload screenshot");
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !city || !address) {
      toast.error("Please fill in all shipping details");
      return;
    }
    if (paymentMethod !== "COD" && !transactionId) {
      toast.error("Transaction ID is required for online payments");
      return;
    }
    try {
      setPlacingOrder(true);
      if (saveShippingInfo) {
        localStorage.setItem("checkout_fullName", fullName);
        localStorage.setItem("checkout_email", email);
        localStorage.setItem("checkout_phone", phone);
        localStorage.setItem("checkout_city", city);
        localStorage.setItem("checkout_address", address);
      } else {
        ["checkout_fullName","checkout_email","checkout_phone","checkout_city","checkout_address"]
          .forEach((k) => localStorage.removeItem(k));
      }

      const orderItems = cartItems.map((item) => ({
        book: item._id,
        title: item.title,
        image: item.images?.[0] || "",
        quantity: item.quantity,
        price: item.discountedPrice > 0 && item.discountedPrice < item.originalPrice
          ? item.discountedPrice : item.originalPrice,
      }));

      const order = await dispatch(
        createOrderAction({
          orderItems,
          shippingAddress: { fullName, city, address, phone, email },
          paymentMethod,
          deliveryCharges,
          subtotal,
          totalPrice,
          couponDiscount,
          transactionId: paymentMethod === "COD" ? "" : transactionId,
          paymentScreenshot: paymentMethod === "COD" ? "" : screenshot,
        })
      ).unwrap();

      if (paymentMethod !== "COD") {
        try {
          await dispatch(submitPayment({ orderId: order._id, transactionId, paymentMethod, screenshot })).unwrap();
        } catch (err) {
          console.error("Legacy payment creation failed but order placed:", err);
        }
      }

      toast.success("Order placed successfully!");
      if (isDirect) {
        dispatch(clearDirectCheckoutItem());
      } else {
        dispatch(clearCart());
      }
      dispatch(resetOrderState());
      if (isAuthenticated) {
        navigate("/orders");
      } else {
        navigate(`/track/${order._id}`);
      }
    } catch (error) {
      toast.error(error.message || "Failed to place order. Check stock availability.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const activeAccounts = settings?.paymentMethods || {
    jazzcash:     { number: "0300-1234567", accountTitle: "Old Books Store" },
    easypaisa:    { number: "0315-1234567", accountTitle: "Old Books Store" },
    bankTransfer: { bankName: "Meezan Bank", accountNumber: "1234-5678-9012", accountTitle: "Old Books Store" },
  };

  /* ── inject styles once ── */
  useEffect(() => {
    if (document.getElementById("checkout-styles")) return;
    const tag = document.createElement("style");
    tag.id = "checkout-styles";
    tag.textContent = styles;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  const paymentMethods = [
    { id: "COD",           label: "Cash on Delivery" },
    { id: "JazzCash",      label: "JazzCash" },
    { id: "EasyPaisa",     label: "EasyPaisa" },
    { id: "Bank Transfer", label: "Bank Transfer" },
  ];

  return (
    <div className="co">
      <BackBtn />

      {/* ── Page Header ── */}
      <div className="co-header">
        <div>
          <div className="co-header__eyebrow">
            <ShieldCheck size={11} />
            Secure Checkout
          </div>
          <h1 className="co-header__title">Complete Your Order</h1>
          <p className="co-header__sub">Fill in your delivery and payment details below</p>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <form onSubmit={handlePlaceOrder}>
        <div className="co-grid">

          {/* ════ LEFT — FORMS ════ */}
          <div className="co-main-col">

            {/* SHIPPING SECTION */}
            <div className="co-section">
              <div className="co-section__head">
                <span className="co-section__icon"><Truck size={15} /></span>
                <div>
                  <h2 className="co-section__title">Shipping Details</h2>
                </div>
              </div>
              <div className="co-section__body">
                <div className="co-form-grid">

                  <div>
                    <label className="co-label">Full Name</label>
                    <input
                      className="co-input" type="text" required
                      placeholder="Muhammad Ali"
                      value={fullName} onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="co-label">Phone Number</label>
                    <input
                      className="co-input" type="tel" required
                      placeholder="03XX-XXXXXXX"
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="co-label">Email Address</label>
                    <input
                      className="co-input" type="email" required
                      placeholder="email@example.com"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="co-label">City</label>
                    <input
                      className="co-input"
                      type="text"
                      required
                      placeholder="Karachi"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="co-form-full">
                    <label className="co-label">Delivery Address</label>
                    <textarea
                      className="co-textarea" rows={3} required
                      placeholder="House No., Street, Area / Sector..."
                      value={address} onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                </div>

                <div className="co-checkbox-row">
                  <input
                    type="checkbox" id="saveInfo" className="co-checkbox"
                    checked={saveShippingInfo} onChange={(e) => setSaveShippingInfo(e.target.checked)}
                  />
                  <label htmlFor="saveInfo" className="co-checkbox-label">
                    Save shipping info for future orders
                  </label>
                </div>
              </div>
            </div>

            {/* PAYMENT SECTION */}
            <div className="co-section">
              <div className="co-section__head">
                <span className="co-section__icon"><CreditCard size={15} /></span>
                <div>
                  <h2 className="co-section__title">Payment Method</h2>
                </div>
              </div>
              <div className="co-section__body">

                {/* Method Selector */}
                <div className="co-pay-grid">
                  {paymentMethods.map((m) => (
                    <button
                      key={m.id} type="button"
                      className={`co-pay-btn${paymentMethod === m.id ? " co-pay-btn--active" : ""}`}
                      onClick={() => setPaymentMethod(m.id)}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Online Payment Details */}
                {paymentMethod !== "COD" && (
                  <div className="co-pay-info">

                    {/* Alert */}
                    <div className="co-pay-alert">
                      <AlertTriangle size={13} className="co-pay-alert__icon" />
                      <p className="co-pay-alert__text">
                        Send exactly <strong>Rs. {totalPrice}</strong> to the account below, then enter your Transaction ID and upload the receipt.
                      </p>
                    </div>

                    {/* JazzCash */}
                    {paymentMethod === "JazzCash" && (
                      <>
                        <p className="co-account-label">Account Title</p>
                        <p className="co-account-value">{activeAccounts.jazzcash.accountTitle}</p>
                        <div className="co-account-divider" />
                        <p className="co-account-label">JazzCash Number</p>
                        <p className="co-account-value--gold">{activeAccounts.jazzcash.number}</p>
                      </>
                    )}

                    {/* EasyPaisa */}
                    {paymentMethod === "EasyPaisa" && (
                      <>
                        <p className="co-account-label">Account Title</p>
                        <p className="co-account-value">{activeAccounts.easypaisa.accountTitle}</p>
                        <div className="co-account-divider" />
                        <p className="co-account-label">EasyPaisa Number</p>
                        <p className="co-account-value--gold">{activeAccounts.easypaisa.number}</p>
                      </>
                    )}

                    {/* Bank Transfer */}
                    {paymentMethod === "Bank Transfer" && (
                      <>
                        <p className="co-account-label">Bank Name</p>
                        <p className="co-account-value">{activeAccounts.bankTransfer.bankName}</p>
                        <div className="co-account-divider" />
                        <p className="co-account-label">Account Title</p>
                        <p className="co-account-value">{activeAccounts.bankTransfer.accountTitle}</p>
                        <div className="co-account-divider" />
                        <p className="co-account-label">Account Number / IBAN</p>
                        <p className="co-account-value--gold">{activeAccounts.bankTransfer.accountNumber}</p>
                      </>
                    )}

                    {/* Proof Inputs */}
                    <div className="co-proof-grid">
                      <div>
                        <label className="co-label">Transaction ID *</label>
                        <input
                          className="co-input" type="text" required
                          placeholder="TXN-XXXXXXXX"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          style={{ textTransform: "uppercase" }}
                        />
                      </div>
                      <div>
                        <label className="co-label">Payment Screenshot</label>
                        <input
                          type="file" accept="image/*"
                          className="co-file-input"
                          onChange={handleScreenshotUpload}
                        />
                        {uploadingImage && (
                          <p className="co-upload-hint">Uploading screenshot...</p>
                        )}
                        {screenshot && !uploadingImage && (
                          <p className="co-upload-hint" style={{ color: "var(--co-success)" }}>
                            ✓ Screenshot uploaded
                          </p>
                        )}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>

          </div>{/* end co-main-col */}

          {/* ════ RIGHT — ORDER SUMMARY ════ */}
          <div className="co-sidebar-col">
            <div className="co-summary">
              <div className="co-summary__head">
                <h3 className="co-summary__title"> Review Your Order</h3>
              </div>
              <div className="co-summary__body">

                {/* Items */}
                <div className="co-items-list">
                  {cartItems.map((item) => {
                    const price = item.discountedPrice > 0 && item.discountedPrice < item.originalPrice
                      ? item.discountedPrice : item.originalPrice;
                    return (
                      <div key={item._id} className="co-order-item">
                        <span className="co-order-item__title">{item.title}</span>
                        <span className="co-order-item__qty">×{item.quantity}</span>
                        <span className="co-order-item__price">Rs. {price * item.quantity}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="co-totals">
                  <div className="co-total-row">
                    <span className="co-total-row__label">Subtotal</span>
                    <span className="co-total-row__val">Rs. {subtotal}</span>
                  </div>
                  <div className="co-total-row">
                    <span className="co-total-row__label">Delivery</span>
                    <span className="co-total-row__val">Rs. {deliveryCharges}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="co-total-row co-total-row--discount">
                      <span className="co-total-row__label">Discount</span>
                      <span className="co-total-row__val">− Rs. {couponDiscount}</span>
                    </div>
                  )}
                </div>

                <div className="co-grand-total">
                  <span className="co-grand-total__label">Grand Total</span>
                  <span className="co-grand-total__val">Rs. {totalPrice}</span>
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  className="co-place-btn"
                  disabled={placingOrder || uploadingImage}
                >
                  {placingOrder ? <ButtonLoader label="Placing Order..." /> : "Confirm & Place Order"}
                </button>

                <p className="co-secure-note">
                  <ShieldCheck size={11} />
                  Secure checkout · Genuine books
                </p>

              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default Checkout;