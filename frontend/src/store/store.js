import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./slices/settingsSlice";
import authReducer from "./slices/authSlice";
import bookReducer from "./slices/bookSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import categoryReducer from "./slices/categorySlice";
import authorReducer from "./slices/authorSlice";
import orderReducer from "./slices/orderSlice";
import paymentReducer from "./slices/paymentSlice";
import notificationReducer from "./slices/notificationSlice";
import cmsReducer from "./slices/cmsSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    auth: authReducer,
    books: bookReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    categories: categoryReducer,
    authors: authorReducer,
    orders: orderReducer,
    payments: paymentReducer,
    notifications: notificationReducer,
    cms: cmsReducer,
    users: userReducer,
  },
});