import { createSlice } from "@reduxjs/toolkit";

const getLocalCart = () => {
  try {
    const items = localStorage.getItem("cartItems");
    return items ? JSON.parse(items) : [];
  } catch (error) {
    return [];
  }
};

const getLocalCoupon = () => {
  try {
    const coupon = localStorage.getItem("cartCoupon");
    return coupon ? JSON.parse(coupon) : null;
  } catch (error) {
    return null;
  }
};

const getLocalDelivery = () => {
  try {
    const delivery = localStorage.getItem("cartDeliveryCharges");
    return delivery ? Number(delivery) : 150;
  } catch (error) {
    return 150;
  }
};

const getInitialTotals = () => {
  const cartItems = getLocalCart();
  const coupon = getLocalCoupon();
  const deliveryCharges = getLocalDelivery();
  
  let subtotal = 0;
  cartItems.forEach((item) => {
    const price = item.discountedPrice > 0 && item.discountedPrice < item.originalPrice
      ? item.discountedPrice
      : item.originalPrice;
    subtotal += price * item.quantity;
  });

  let discount = 0;
  if (coupon) {
    const type = coupon.discountType?.toLowerCase();
    if (type === "percentage") {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
    } else if (type === "fixed") {
      discount = coupon.discountValue;
    }
  }

  const totalPrice = Math.max(subtotal + deliveryCharges - discount, 0);

  return {
    cartItems,
    subtotal,
    deliveryCharges,
    coupon,
    couponDiscount: discount,
    totalPrice,
  };
};

const initialState = { ...getInitialTotals(), directCheckoutItem: null };

const calculateTotals = (state) => {
  let subtotal = 0;
  state.cartItems.forEach((item) => {
    const price = item.discountedPrice > 0 && item.discountedPrice < item.originalPrice
      ? item.discountedPrice
      : item.originalPrice;
    subtotal += price * item.quantity;
  });

  state.subtotal = subtotal;

  let discount = 0;
  if (state.coupon) {
    const type = state.coupon.discountType?.toLowerCase();
    if (type === "percentage") {
      discount = Math.round((subtotal * state.coupon.discountValue) / 100);
    } else if (type === "fixed") {
      discount = state.coupon.discountValue;
    }
  }

  state.couponDiscount = discount;
  state.totalPrice = Math.max(subtotal + state.deliveryCharges - discount, 0);

  localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  localStorage.setItem("cartCoupon", state.coupon ? JSON.stringify(state.coupon) : "");
  localStorage.setItem("cartDeliveryCharges", String(state.deliveryCharges));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { book, quantity = 1 } = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === book._id);

      if (existingItem) {
        if (existingItem.quantity + quantity <= book.stock) {
          existingItem.quantity += quantity;
        } else {
          existingItem.quantity = book.stock;
        }
      } else {
        state.cartItems.push({
          ...book,
          quantity: Math.min(quantity, book.stock),
        });
      }
      calculateTotals(state);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((item) => item._id !== id);
      calculateTotals(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item._id === id);
      if (existingItem) {
        existingItem.quantity = Math.max(1, Math.min(quantity, existingItem.stock));
      }
      calculateTotals(state);
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload;
      calculateTotals(state);
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.couponDiscount = 0;
      calculateTotals(state);
    },
    setDeliveryCharges: (state, action) => {
      state.deliveryCharges = action.payload;
      calculateTotals(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.coupon = null;
      state.couponDiscount = 0;
      state.subtotal = 0;
      state.totalPrice = 0;
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cartCoupon");
      localStorage.removeItem("cartDeliveryCharges");
    },
    setDirectCheckoutItem: (state, action) => {
      state.directCheckoutItem = action.payload;
    },
    clearDirectCheckoutItem: (state) => {
      state.directCheckoutItem = null;
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  removeCoupon,
  setDeliveryCharges,
  clearCart,
  setDirectCheckoutItem,
  clearDirectCheckoutItem,
} = cartSlice.actions;

export default cartSlice.reducer;
