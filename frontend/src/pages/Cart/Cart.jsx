import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  setDeliveryCharges,
  clearCart,
  clearDirectCheckoutItem
} from "../../store/slices/cartSlice";
import { fetchSettings } from "../../store/slices/cmsSlice";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { Trash2, ShoppingBag, ArrowRight, Tag, X, BookOpen, Package, ChevronRight } from "lucide-react";

const styles = `
  :root {
    --color-bg:          #0a0a0b;
    --color-card-bg:     #111114;
    --color-card-hover:  #16161a;
    --color-border:      #222228;
    --color-border-soft: #1a1a20;
    --color-primary:     #c8860a;
    --color-primary-dim: rgba(200,134,10,0.12);
    --color-primary-glow:rgba(200,134,10,0.06);
    --color-text:        #f0ede8;
    --color-muted:       #DCDCDC;
    --color-muted-2:     #44424a;
    --color-success:     #10b981;
    --color-success-dim: rgba(16,185,129,0.10);
    --color-danger:      #ef4444;
    --font-body:         system-ui, sans-serif;
    --radius-card:       0px;
    --radius-btn:        0px;
    --radius-input:      0px;
    --shadow-card:       0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px var(--color-border);
    --transition:        all 0.18s ease;
  }

  .cart-root * { box-sizing: border-box; }
  .cart-root { font-family: var(--font-body); background: var(--color-bg); color: var(--color-text); }

  /* ── Page header ── */
  .co-header__eyebrow {
    display: flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 700; letter-spacing: .13em;
    text-transform: uppercase; color: var(--color-primary); margin-bottom: 6px;
  }
  .cart-header { padding-bottom: 28px; border-bottom: 1px solid var(--color-border); margin-bottom: 28px; }
  .cart-header__eyebrow { display: flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: var(--color-primary); margin-bottom: 10px; }
  .cart-header__title { font-family: var(--font-body); font-size: clamp(26px, 4vw, 36px); font-weight: 800; color: var(--color-text); line-height: 1.15; margin: 0 0 6px; letter-spacing: -0.01em; }
  .cart-header__sub { font-size: 13px; color: var(--color-muted); margin: 0; }

  /* ── Layout grid ── */
  .cart-grid { display: grid; gap: 24px; }
  @media (min-width: 1024px) { .cart-grid { grid-template-columns: 1fr 360px; } }

  /* ── Cart item card ── */
  .cart-item {
    display: flex; align-items: flex-start; gap: 16px;
    background: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: 0;
    padding: 16px;
    box-shadow: var(--shadow-card);
    transition: var(--transition);
    position: relative;
    overflow: hidden;
  }
  .cart-item::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
    background: linear-gradient(180deg, var(--color-primary) 0%, transparent 100%);
    opacity: 0; transition: var(--transition);
  }
  .cart-item:hover { border-color: var(--color-muted-2); background: var(--color-card-hover); }
  .cart-item:hover::before { opacity: 1; }

  .cart-item__img-wrap { flex-shrink: 0; }
  .cart-item__img {
    width: 62px; height: 88px; object-fit: cover;
    border-radius: 0; border: 1px solid var(--color-border);
    display: block;
  }

  .cart-item__meta { flex: 1; min-width: 0; }
  .cart-item__category {
    font-size: 9.5px; font-weight: 700; letter-spacing: .13em; text-transform: uppercase;
    color: var(--color-primary); margin-bottom: 4px; display: block;
  }
  .cart-item__title {
    font-size: 14px; font-weight: 600; color: var(--color-text);
    line-height: 1.35; margin: 0 0 3px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    text-decoration: none; display: block; transition: color .15s;
  }
  .cart-item__title:hover { color: var(--color-primary); }
  .cart-item__author { font-size: 11.5px; color: var(--color-muted); margin: 0 0 4px; }
  .cart-item__condition {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 10px; font-weight: 600; color: var(--color-primary);
    background: var(--color-primary-dim); border-radius: 0;
    padding: 2px 7px;
  }

  /* ── Right col of cart item: qty + price + delete ── */
  .cart-item__actions {
    display: flex; flex-direction: column; align-items: flex-end;
    justify-content: space-between; gap: 12px;
    flex-shrink: 0;
  }
  @media (min-width: 540px) {
    .cart-item__actions { flex-direction: row; align-items: center; }
    .cart-item { align-items: center; }
  }

  /* ── Qty control ── */
  .qty-control {
    display: inline-flex; align-items: center;
    background: #0d0d10; border: 1px solid var(--color-border);
    border-radius: 0; overflow: hidden;
  }
  .qty-btn {
    width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
    background: transparent; border: none; cursor: pointer;
    color: var(--color-muted); font-size: 16px; font-weight: 700;
    transition: var(--transition);
  }
  .qty-btn:hover { color: var(--color-text); background: var(--color-border); }
  .qty-value {
    width: 32px; text-align: center; font-size: 13px; font-weight: 600;
    color: var(--color-text); user-select: none;
  }

  /* ── Price block ── */
  .price-block { text-align: right; min-width: 72px; }
  .price-total { font-size: 15px; font-weight: 700; color: var(--color-text); display: block; }
  .price-each { font-size: 10.5px; color: var(--color-muted); display: block; margin-top: 1px; }

  /* ── Delete btn ── */
  .delete-btn {
    background: transparent; border: none; cursor: pointer;
    color: var(--color-muted-2); padding: 6px;
    border-radius: 0; transition: var(--transition);
    display: flex; align-items: center;
  }
  .delete-btn:hover { color: var(--color-danger); background: rgba(239,68,68,.08); }

  /* ─────────────── ORDER SUMMARY SIDEBAR ─────────────── */
  .summary-card {
    background: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: 0;
    padding: 22px;
    box-shadow: var(--shadow-card);
    position: sticky; top: 118px;
  }
  .summary-card__title {
    font-family: var(--font-body); font-size: 18px; font-weight: 700;
    color: var(--color-text); margin: 0 0 16px; padding-bottom: 14px;
    border-bottom: 1px solid var(--color-border); letter-spacing: -0.01em;
  }
  .summary-rows { display: flex; flex-direction: column; gap: 11px; }
  .summary-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
  .summary-row__label { color: var(--color-muted); }
  .summary-row__val { font-weight: 600; color: var(--color-text); }
  .summary-divider { height: 1px; background: var(--color-border); margin: 4px 0; }
  .summary-total { display: flex; justify-content: space-between; align-items: center; padding-top: 14px; border-top: 1px solid var(--color-border); }
  .summary-total__label { font-size: 14px; font-weight: 600; color: var(--color-text); }
  .summary-total__val { font-size: 20px; font-weight: 800; color: var(--color-primary); font-family: var(--font-body); }

  /* ── Coupon applied row ── */
  .coupon-applied {
    display: flex; justify-content: space-between; align-items: center;
    background: var(--color-success-dim); border: 1px solid rgba(16,185,129,.2);
    border-radius: 0; padding: 9px 12px; font-size: 12.5px;
    color: var(--color-success); font-weight: 600;
  }
  .coupon-applied__left { display: flex; align-items: center; gap: 6px; }
  .coupon-applied__right { display: flex; align-items: center; gap: 8px; }
  .coupon-remove-btn { background: transparent; border: none; cursor: pointer; color: rgba(239,68,68,.7); padding: 0; display: flex; transition: var(--transition); }
  .coupon-remove-btn:hover { color: var(--color-danger); }

  /* ── Coupon input form ── */
  .coupon-form { display: flex; gap: 8px; }
  .coupon-input {
    flex: 1; background: #0d0d10; border: 1px solid var(--color-border);
    border-radius: 0; padding: 10px 14px;
    font-size: 12px; font-family: var(--font-body); color: var(--color-text);
    outline: none; transition: var(--transition); letter-spacing: .06em;
  }
  .coupon-input::placeholder { color: var(--color-muted); }
  .coupon-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 2px var(--color-primary-dim); }
  .coupon-btn {
    background: #161619; border: 1px solid var(--color-border);
    border-radius: 0; padding: 10px 16px;
    font-size: 11.5px; font-weight: 700; font-family: var(--font-body);
    color: var(--color-text); cursor: pointer; transition: var(--transition);
    white-space: nowrap;
  }
  .coupon-btn:hover:not(:disabled) { border-color: var(--color-primary); color: var(--color-primary); }
  .coupon-btn:disabled { opacity: .45; cursor: not-allowed; }

  /* ── CTA / Primary button ── */
  .cta-btn {
    width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
    background: var(--color-primary); color: #000;
    border: none; border-radius: 0;
    padding: 14px 20px; font-size: 13.5px; font-weight: 700;
    font-family: var(--font-body); cursor: pointer; transition: var(--transition);
    letter-spacing: .02em;
  }
  .cta-btn:hover { opacity: .88; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,134,10,.25); }
  .cta-btn:active { transform: translateY(0); }

  /* ── Empty state ── */
  .empty-state {
    min-height: 420px; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 20px;
    padding: 48px 24px; text-align: center;
  }
  .empty-icon-wrap {
    width: 80px; height: 80px; border-radius: 0;
    background: var(--color-card-bg); border: 1px solid var(--color-border);
    display: flex; align-items: center; justify-content: center;
    box-shadow: var(--shadow-card);
  }
  .empty-title { font-family: var(--font-body); font-size: 24px; font-weight: 700; color: var(--color-text); margin: 0 0 6px; letter-spacing: -0.01em; }
  .empty-desc { font-size: 13px; color: var(--color-muted); margin: 0; max-width: 280px; line-height: 1.6; }
  .empty-cta {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--color-primary); color: #000;
    border-radius: 0; padding: 12px 24px;
    font-size: 13px; font-weight: 700; font-family: var(--font-body);
    text-decoration: none; transition: var(--transition); margin-top: 4px;
  }
  .empty-cta:hover { opacity: .88; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,134,10,.25); }

  /* ── Separator label ── */
  .section-block { display: flex; flex-direction: column; gap: 10px; }

  /* ── Item count badge ── */
  .item-count-badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600; color: var(--color-muted);
    background: var(--color-card-bg); border: 1px solid var(--color-border);
    border-radius: 0; padding: 3px 9px;
  }
`;

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, subtotal, deliveryCharges, coupon, couponDiscount, totalPrice } = useSelector(
    (state) => state.cart
  );
  const { settings } = useSelector((state) => state.cms);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [couponCode, setCouponCode] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings?.deliveryCharges) {
      const values = Object.values(settings.deliveryCharges);
      if (values.length > 0) {
        dispatch(setDeliveryCharges(values[0]));
      }
    }
  }, [settings, dispatch]);

  const handleQtyChange = (id, quantity, stock) => {
    if (quantity < 1) return;
    if (quantity > stock) {
      toast.error(`Only ${stock} copies available in stock`);
      return;
    }
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to use coupon codes");
      navigate("/login");
      return;
    }
    if (!couponCode.trim()) return;

    try {
      setValidatingCoupon(true);
      const res = await axiosInstance.post("/coupons/validate", {
        code: couponCode.trim(),
        orderAmount: subtotal,
      });

      const validatedCoupon = res.data.coupon;
      const formattedCoupon = {
        code: validatedCoupon.code,
        discountType: validatedCoupon.discountType === "percentage" ? "Percentage" : "Fixed",
        discountValue: validatedCoupon.discountValue,
      };

      dispatch(applyCoupon(formattedCoupon));
      toast.success("Coupon code applied successfully!");
      setCouponCode("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid coupon code");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    toast.success("Coupon code removed");
  };

  const handleProceedToCheckout = () => {
    dispatch(clearDirectCheckoutItem());
    navigate("/checkout");
  };

  /* ── inject styles once ── */
  useEffect(() => {
    if (document.getElementById("cart-styles")) return;
    const tag = document.createElement("style");
    tag.id = "cart-styles";
    tag.textContent = styles;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  /* ═══════════════════ EMPTY STATE ═══════════════════ */
  if (cartItems.length === 0) {
    return (
      <div className="cart-root">
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <ShoppingBag size={34} style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <h2 className="empty-title">Your Cart is Empty</h2>
            <p className="empty-desc">You haven't added any books yet. Browse our catalog and find your next read.</p>
          </div>
          <Link to="/books" className="empty-cta">
            Explore Catalog <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  /* ═══════════════════ MAIN CART ═══════════════════ */
  return (
    <div className="cart-root">

      {/* ── Page Header ── */}
      <div className="cart-header">
        <div className="co-header__eyebrow">
  <ShoppingBag size={11} />
  Your Selections
</div>
        <h1 className="cart-header__title">Your Cart</h1>
        <p className="cart-header__sub">Review your selections and proceed when ready.</p>
      </div>

      {/* ── Main Grid ── */}
      <div className="cart-grid">

        {/* ════════ LEFT — CART ITEMS ════════ */}
        <div className="section-block">

          {/* item count */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span className="item-count-badge">
              <Package size={11} />
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </span>
          </div>

          {cartItems.map((item) => {
            const hasDiscount = item.discountedPrice > 0 && item.discountedPrice < item.originalPrice;
            const price = hasDiscount ? item.discountedPrice : item.originalPrice;

            return (
              <div key={item._id} className="cart-item">

                {/* Book cover */}
                <div className="cart-item__img-wrap">
                  <img
                    src={item.images?.[0] || "https://placehold.co/62x88/111114/c8860a?text=Book"}
                    alt={item.title}
                    className="cart-item__img"
                  />
                </div>

                {/* Metadata */}
                <div className="cart-item__meta">
                  <span className="cart-item__category">{item.category?.name || "Book"}</span>
                  <Link to={`/book/${item._id}`} className="cart-item__title">{item.title}</Link>
                  <p className="cart-item__author">By {item.author?.name}</p>
                  <span className="cart-item__condition">{item.condition} Copy</span>
                </div>

                {/* Qty + Price + Delete */}
                <div className="cart-item__actions">
                  {/* Qty control */}
                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => handleQtyChange(item._id, item.quantity - 1, item.stock)}
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQtyChange(item._id, item.quantity + 1, item.stock)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>

                  {/* Price */}
                  <div className="price-block">
                    <span className="price-total">Rs. {price * item.quantity}</span>
                    {item.quantity > 1 && (
                      <span className="price-each">Rs. {price} each</span>
                    )}
                  </div>

                  {/* Delete */}
                  <button
                    className="delete-btn"
                    onClick={() => dispatch(removeFromCart(item._id))}
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* ════════ RIGHT — ORDER SUMMARY ════════ */}
        <div>
          <div className="summary-card">
            <h3 className="summary-card__title">Order Summary</h3>

            {/* Rows */}
            <div className="summary-rows">
              <div className="summary-row">
                <span className="summary-row__label">Subtotal ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})</span>
                <span className="summary-row__val">Rs. {subtotal}</span>
              </div>

              <div className="summary-row">
                <span className="summary-row__label">Delivery Charges</span>
                <span className="summary-row__val">Rs. {deliveryCharges}</span>
              </div>

              {/* Coupon applied */}
              {coupon && (
                <div className="coupon-applied">
                  <div className="coupon-applied__left">
                    <Tag size={12} />
                    <span>{coupon.code}</span>
                  </div>
                  <div className="coupon-applied__right">
                    <span>− Rs. {couponDiscount}</span>
                    <button
                      className="coupon-remove-btn"
                      onClick={handleRemoveCoupon}
                      aria-label="Remove coupon"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="summary-total">
                <span className="summary-total__label">Total Amount</span>
                <span className="summary-total__val">Rs. {totalPrice}</span>
              </div>
            </div>

            {/* Coupon input */}
            {!coupon && (
              <form
                onSubmit={handleApplyCoupon}
                className="coupon-form"
                style={{ marginTop: 18 }}
              >
                <input
                  type="text"
                  className="coupon-input"
                  placeholder="Promo code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
                <button
                  type="submit"
                  className="coupon-btn"
                  disabled={validatingCoupon}
                >
                  {validatingCoupon ? "..." : "Apply"}
                </button>
              </form>
            )}

            {/* Checkout CTA */}
            <button
              className="cta-btn"
              style={{ marginTop: 18 }}
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;