# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Frontend Development Steps Followed

## Step 1 — Project Initialization
- Created React + Vite application
- Installed frontend dependencies
- Installed Tailwind CSS v4
- Configured Vite environment

---

## Step 2 — Folder Structure Architecture
- Created scalable frontend folder structure
- Organized folders by:
  - components
  - layouts
  - pages
  - routes
  - services
  - store
  - context
  - hooks
  - utils
  - constants
  - data
  - styles
  - providers
  - seo
  - guards
  - skeletons
  - features

---

## Step 3 — Styling System Setup
- Configured Tailwind CSS v4
- Created:
  - globals.css
  - variables.css
  - animations.css
- Defined global design tokens
- Added responsive container system

---

## Step 4 — Main Application Setup
- Created:
  - main.jsx
  - App.jsx
- Configured:
  - BrowserRouter
  - Redux Provider
  - Helmet Provider
  - Toast Provider

---

## Step 5 — Redux Architecture
- Created Redux store setup
- Prepared Redux slice architecture

---

## Step 6 — Routing System Architecture
- Created:
  - AppRoutes.jsx
  - ProtectedRoute.jsx
  - AdminRoute.jsx
- Configured:
  - public routes
  - protected routes
  - admin routes
  - 404 route handling

---

## Step 7 — Authentication Architecture
- Planned JWT-ready authentication system
- Added role-based access structure
- Prepared persistent auth architecture

---

## Step 8 — API Architecture
- Created centralized API architecture
- Prepared:
  - axios setup
  - endpoints system
  - services layer

---

## Step 9 — Layout Architecture Decision
- Finalized enterprise layout architecture
- Decided:
  - layouts only manage structure
  - UI separated into components

---

## Step 10 — Layout System Creation
- Created:
  - MainLayout
  - AuthLayout
  - DashboardLayout
  - AdminLayout

---

## Step 11 — Component Separation Strategy
- Header/Footer separated from layouts
- Sidebar/Header separated for dashboards
- Planned modular UI architecture

---

## Step 12 — Responsive Architecture
- Added responsive-first layout system
- Prepared:
  - responsive containers
  - responsive wrappers
  - scalable spacing system

---

## Step 13 — Company Data System Planning
- Planned centralized company data architecture
- Prepared data structure for:
  - logo
  - company info
  - payment methods
  - social links
  - CMS content

---

## Step 14 — Frontend + Backend Integration Planning
- Compared frontend architecture with backend system
- Prepared frontend for:
  - Auth APIs
  - Books APIs
  - Categories APIs
  - Orders APIs
  - Payments APIs
  - Coupons APIs
  - CMS APIs

---

## Step 15 — Final Architecture Standardization
- Finalized scalable enterprise architecture
- Applied:
  - separation of concerns
  - modular UI system
  - reusable component strategy
  - backend-driven frontend architecture

  ## Responsive Navbar System Completed

Implemented:
- Responsive desktop navbar
- Mobile hamburger menu
- Animated mobile sidebar
- Reusable navigation links
- Search bar component
- Cart button component
- User menu button
- Sticky responsive header
- Scroll-based navbar styling
- Framer Motion mobile animations

Navbar Architecture:
- Header.jsx
- DesktopNavbar.jsx
- MobileNavbar.jsx
- MobileSidebar.jsx
- NavLinks.jsx
- Logo.jsx
- SearchBar.jsx
- CartButton.jsx
- UserMenu.jsx

Responsive Behavior:
- Desktop navbar on tablets/desktops
- Hamburger sidebar on mobile
- Animated mobile overlay
- Responsive spacing system