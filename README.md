# BookCorner - Premium Online Bookstore & Management Platform

BookCorner is an enterprise-grade, full-stack web application designed for browsing, purchasing, and managing old and new books. The platform comprises a highly-interactive, premium customer storefront and a comprehensive Admin Control Center with real-time statistics, inventory management, dynamic content management (CMS), order processing, and user access controls.

---

## 🌟 Key Features

### 🛒 Storefront & Customer Experience
- **Fluid Browsing**: Premium user interface featuring responsive typography, smooth animations (Framer Motion), and glassmorphism styling.
- **Advanced Search & Filtering**: Real-time keyword searches filtering through book title, description, author, publisher, ISBN, price ranges, ratings, condition (used/new), and binding type.
- **Dynamic Category & Author Pages**: Automatically generated genre collections and author profiles.
- **Guest Checkout**: Unauthenticated users can instantly checkout using Cash on Delivery (COD) and receive secure "Track Your Order" links via email, while authenticated users track directly from their dashboard.
- **Wishlist & Cart**: Persistent local cart storage and server-persisted user wishlists.
- **Floating WhatsApp Integration**: A persistent, floating communication button with admin-managed custom icons, links, and pre-filled chat messages.
- **Promotional Spotlight**: Auto-triggering spotlight marketing modal on homepage load, fully configurable from the admin panel.

### 🛡️ Admin Control Center
- **Sales & Inventory Analytics**: Graphical summaries of total revenue (in PKR), order status counts, and individual book sales margins.
- **Inventory Management**: Create, read, update, and delete (CRUD) books, including multiple cover image uploads (via Cloudinary integration).
- **Category Management**: Create genres, toggle category visibility (Active/Inactive), and set "Featured" banner groupings.
- **CMS Panel**: Modify promotional banners, announcement text, social links, footer data, and floating WhatsApp configurations in real-time without database code changes.
- **Order & Payments Processing**: Track orders from "Pending" to "Shipped" or "Delivered" and record transaction slips.
- **Security Dashboard**: Synchronized admin accounts in MongoDB with automatic environment file updates, plus the ability to block/unblock inactive accounts.

---

## 🏗️ Folder Structure

```
OldBooksStore/
├── backend/
│   ├── src/
│   │   ├── config/             # DB & Cloudinary configs
│   │   ├── controllers/        # Business logic & controller handlers
│   │   ├── middleware/         # Auth guards, image uploads, error handlers
│   │   ├── models/             # Mongoose schemas (Book, Category, Settings, etc.)
│   │   ├── routes/             # Express endpoint routing
│   │   ├── services/           # Nodemailer and file upload services
│   │   ├── utils/              # Helper functions (tokens, env sync)
│   │   └── app.js / server.js  # Express server initialization
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── api/                # Axios instance with auth interceptors
    │   ├── components/         # Modular UI units (navbar, books, admin tables)
    │   ├── data/               # Static site metadata & configurations
    │   ├── features/           # Redux state controllers
    │   ├── layouts/            # Page structures (AdminLayout, MainLayout, AuthLayout)
    │   ├── pages/              # Main view panels (Home, Books, AdminDashboard)
    │   ├── routes/             # React Router routing map (AppRoutes)
    │   ├── store/              # Redux Toolkit global store configuration
    │   └── styles/             # Global design tokens (globals.css, variables.css)
    ├── package.json
    └── index.html
```

---

## ⚙️ Business Logic Highlights

### 🔄 Dynamic Category Activation/Deactivation
To prevent customers from viewing or ordering items in temporarily unavailable genres, BookCorner features a robust category filtering system:
- **Backend Exclusion Filter (`$nin`)**: When fetching books for the storefront homepage, featured collections, search listings, or single-book details, the backend resolves the list of all *inactive* category IDs (`Category.find({ isActive: false })`) and applies a `{ category: { $nin: inactiveCategoryIds } }` query parameter. This ensures books belonging to inactive categories are completely hidden, while books with `null` categories or active categories are displayed.
- **Admin Visibility**: Authenticated administrative accounts bypass this restriction. The backend uses `optionalProtect` middleware to identify admin sessions, allowing the Admin Category Dashboard to load, view, search, and reactivate categories regardless of their current status.

---

## 🚀 Installation & Setup

### 📋 Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (running locally on port 27017 or a MongoDB Atlas connection string)
- **Cloudinary Account** (for image uploads)
- **SMTP Mailer** (Gmail app password or commercial SMTP credentials)

### 1️⃣ Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend root directory and configure the following variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/oldbooksstore
   JWT_SECRET=your_jwt_secret_key
   ADMIN_EMAIL=ibneadam4542@gmail.com
   ADMIN_PASSWORD=Afzaal15
   ADMIN_NAME="Muhammad Afzaal"
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   EMAIL_USER=your_smtp_gmail_username@gmail.com
   EMAIL_PASS=your_gmail_app_password
   GOOGLE_CLIENT_ID=your_google_client_id
   FRONTEND_URL=http://localhost:5173
   CLIENT_URL=http://localhost:5173
   ```
4. Start the server (using nodemon for development):
   ```bash
   npm run dev
   ```

### 2️⃣ Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the frontend root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Run the frontend build or start the dev server:
   ```bash
   # Start dev server
   npm run dev
   
   # Build for production
   npm run build
   ```

---

## 🧪 Seeding & Database Synchronization
Upon initial server startup, the backend checks for the presence of the system administration profile matching `ibneadam4542@gmail.com` in MongoDB. If not present, the seeder automatically inserts:
- **Admin Email**: `ibneadam4542@gmail.com`
- **Admin Password**: `Afzaal15`

When updating settings or security credentials via the Admin Panel, variables are automatically synchronized back to the backend database schema and written dynamically to the `.env` configuration file to ensure environment consistency.

---

## 🛠️ Tech Stack & Styling Tokens
- **Frontend**: React.js, Vite, Redux Toolkit, Framer Motion, Tailwind CSS v4, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JSON Web Token, Nodemailer, Cloudinary, Multer.
- **Currency System**: Hardcoded to `PKR` format ("Rs. X" / "X PKR") matching region requirements.
- **Styling variables.css**:
  - `--color-primary`: `#c8860a` (Golden Accent)
  - `--color-bg`: `#0a0a0b` (Deep Dark Theme)
  - `--color-card-bg`: `#111114` (Glassmorphism dark gray cards)
  - `--color-border`: `#222228` (Subtle boundary borders)
