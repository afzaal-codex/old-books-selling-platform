import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Routes,
  Route,
} from "react-router-dom";
import { fetchSettings } from "../store/slices/cmsSlice";

import Books from "../pages/Books/Books";
import BookDetails from "../pages/BookDetails/BookDetails";

/* =========================
   ROUTE GUARDS
========================= */

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

/* =========================
   LAYOUTS
========================= */

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";

/* =========================
   AUTH PAGES
========================= */

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail/VerifyEmail";

/* =========================
   ADMIN BOOKS PAGES
========================= */

import AdminBooks from "../pages/AdminBooks/AdminBooks";
import AdminAddBook from "../pages/AdminAddBook/AdminAddBook";
import AdminEditBook from "../pages/AdminBooks/AdminEditBook";

/* =========================
   PUBLIC PAGES
========================= */

import Home from "../pages/Home/Home";
import Categories from "../pages/Categories/Categories";
import CategoryDetails from "../pages/CategoryDetails/CategoryDetails";
import Authors from "../pages/Authors/Authors";
import AuthorDetails from "../pages/AuthorDetails/AuthorDetails";
import Offers from "../pages/Offers/Offers";
import Cart from "../pages/Cart/Cart";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import SellBook from "../pages/SellBook/SellBook";
import FAQ from "../pages/FAQ/FAQ";
import GuestTracking from "../pages/GuestTracking/GuestTracking";

/* =========================
   USER PAGES
========================= */

import Checkout from "../pages/Checkout/Checkout";
import Orders from "../pages/Orders/Orders";
import Wishlist from "../pages/Wishlist/Wishlist";
import Profile from "../pages/Profile/Profile";

/* =========================
   ADMIN PAGES
========================= */

import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import AdminCategories from "../pages/AdminCategories/AdminCategories";
import AdminAuthors from "../pages/AdminAuthors/AdminAuthors";
import AdminOrders from "../pages/AdminOrders/AdminOrders";
import AdminUsers from "../pages/AdminUsers/AdminUsers";
import AdminPayments from "../pages/AdminPayments/AdminPayments";
import AdminCoupons from "../pages/AdminCoupons/AdminCoupons";
import AdminDiscounts from "../pages/AdminDiscounts/AdminDiscounts";
import AdminNotifications from "../pages/AdminNotifications/AdminNotifications";
import AdminCMS from "../pages/AdminCMS/AdminCMS";
import AdminBookRequests from "../pages/AdminBookRequests/AdminBookRequests";
import AdminEmails from "../pages/AdminEmails/AdminEmails";
import AdminNewsletter from "../pages/AdminNewsletter/AdminNewsletter";
import AdminSecurity from "../pages/AdminSecurity/AdminSecurity";

/* =========================
   NOT FOUND PAGE
========================= */

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-7xl font-black text-[var(--color-primary)]">
          404
        </h1>

        <p className="text-xl font-medium text-gray-600">
          Page Not Found
        </p>
      </div>
    </div>
  );
};

/* =========================
   MAIN ROUTES
========================= */

const AppRoutes = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  return (
    <Routes>

      {/* =========================
          PUBLIC WEBSITE ROUTES
      ========================= */}

      <Route element={<MainLayout />}>
        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* BOOKS */}
        <Route
          path="/books"
          element={<Books />}
        />

        <Route
          path="/book/:id"
          element={<BookDetails />}
        />

        {/* CATEGORIES */}
        <Route
          path="/categories"
          element={<Categories />}
        />

        <Route
          path="/category/:slug"
          element={<CategoryDetails />}
        />

        {/* AUTHORS */}
        <Route
          path="/authors"
          element={<Authors />}
        />

        <Route
          path="/author/:slug"
          element={<AuthorDetails />}
        />

        {/* OFFERS */}
        <Route
          path="/offers"
          element={<Offers />}
        />

        {/* CART */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={<About />}
        />

        {/* CONTACT */}
        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* SELL BOOK */}
        <Route
          path="/sell-book"
          element={<SellBook />}
        />

        {/* FAQ */}
        <Route
          path="/faq"
          element={<FAQ />}
        />

        {/* GUEST TRACKING */}
        <Route
          path="/track/:orderId"
          element={<GuestTracking />}
        />
      </Route>

      {/* =========================
          AUTH ROUTES
      ========================= */}

      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />
      </Route>

      <Route
        path="/verify-email/:token"
        element={<VerifyEmail />}
      />

      {/* =========================
          PROTECTED USER ROUTES
      ========================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />
        </Route>
      </Route>

      {/* =========================
          ADMIN ROUTES
      ========================= */}

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          {/* DASHBOARD */}
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          {/* BOOKS */}
          <Route
            path="/admin/books"
            element={<AdminBooks />}
          />

          {/* ADD BOOK */}
          <Route
            path="/admin/add-book"
            element={<AdminAddBook />}
          />

          {/* EDIT BOOK */}
          <Route
            path="/admin/books/edit/:id"
            element={<AdminEditBook />}
          />

          {/* CATEGORIES */}
          <Route
            path="/admin/categories"
            element={<AdminCategories />}
          />

          {/* AUTHORS */}
          <Route
            path="/admin/authors"
            element={<AdminAuthors />}
          />

          {/* ORDERS */}
          <Route
            path="/admin/orders"
            element={<AdminOrders />}
          />

          {/* USERS */}
          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />

          {/* PAYMENTS */}
          <Route
            path="/admin/payments"
            element={<AdminPayments />}
          />

          {/* COUPONS */}
          <Route
            path="/admin/coupons"
            element={<AdminCoupons />}
          />

          {/* DISCOUNTS */}
          <Route
            path="/admin/discounts"
            element={<AdminDiscounts />}
          />

          {/* NOTIFICATIONS */}
          <Route
            path="/admin/notifications"
            element={<AdminNotifications />}
          />

          {/* CMS */}
          <Route
            path="/admin/cms"
            element={<AdminCMS />}
          />

          {/* EMAIL CONFIG */}
          <Route
            path="/admin/emails"
            element={<AdminEmails />}
          />

          <Route
            path="/admin/newsletter"
            element={<AdminNewsletter />}
          />

          <Route
            path="/admin/security"
            element={<AdminSecurity />}
          />

          {/* BOOK REQUESTS */}
          <Route
            path="/admin/requests"
            element={<AdminBookRequests />}
          />
        </Route>
      </Route>

      {/* =========================
          404 PAGE
      ========================= */}

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
};

export default AppRoutes;
