import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const getPageTitle = (pathname) => {
  const pageTitles = {
    "/": "Home",
    "/books": "Books",
    "/categories": "Categories",
    "/authors": "Authors",
    "/offers": "Offers",
    "/cart": "Shopping Cart",
    "/checkout": "Checkout",
    "/about": "About Us",
    "/contact": "Contact Us",
    "/sell-book": "Sell Your Book",
    "/faq": "FAQ",
    "/orders": "My Orders",
    "/wishlist": "My Wishlist",
    "/profile": "My Profile",
    "/admin/dashboard": "Admin Dashboard",
    "/admin/books": "Manage Books",
    "/admin/add-book": "Add Book",
    "/admin/categories": "Manage Categories",
    "/admin/authors": "Manage Authors",
    "/admin/orders": "Manage Orders",
    "/admin/users": "Manage Users",
    "/admin/payments": "Manage Payments",
  };

  // Check for exact match first
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  // Check for dynamic routes
  if (pathname.includes("/book/")) {
    return "Book Details";
  }
  if (pathname.includes("/category/")) {
    return "Category";
  }
  if (pathname.includes("/author/")) {
    return "Author";
  }
  if (pathname.includes("/admin/edit-book/")) {
    return "Edit Book";
  }

  return "Page";
};

const SeoHead = () => {
  const { settings } = useSelector((state) => state.cms);
  const seo = settings?.seo || {};
  const location = useLocation();
  
  const pageTitle = getPageTitle(location.pathname);
  const dynamicTitle = `Book World | ${pageTitle}`;

  return (
    <Helmet>
      <title>{dynamicTitle}</title>
      <meta name="description" content={seo.description || "Online Old Book Store"} />
      <meta name="keywords" content={seo.keywords || "old books, used books, bookstore"} />
    </Helmet>
  );
};

export default SeoHead;
