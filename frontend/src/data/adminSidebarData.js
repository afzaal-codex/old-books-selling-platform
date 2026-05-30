export const adminSidebarData = [
  {
    title: "Dashboard",
    icon: "📊",
    path: "/admin",
  },

  {
    title: "Books",
    icon: "📚",

    children: [
      {
        title: "All Books",
        path: "/admin/books",
      },

      {
        title: "Add Book",
        path: "/admin/add-book",
      },

      {
        title: "Inventory",
        path: "/admin/inventory",
      },

      {
        title: "Featured Books",
        path: "/admin/featured-books",
      },
    ],
  },

  {
    title: "Categories",
    icon: "🗂",

    children: [
      {
        title: "All Categories",
        path: "/admin/categories",
      },

      {
        title: "Add Category",
        path: "/admin/add-category",
      },
    ],
  },

  {
    title: "Authors",
    icon: "✍",

    children: [
      {
        title: "All Authors",
        path: "/admin/authors",
      },

      {
        title: "Add Author",
        path: "/admin/add-author",
      },
    ],
  },

  {
    title: "Orders",
    icon: "🛒",

    children: [
      {
        title: "All Orders",
        path: "/admin/orders",
      },

      {
        title: "Pending Orders",
        path: "/admin/orders/pending",
      },

      {
        title: "Delivered Orders",
        path: "/admin/orders/delivered",
      },
    ],
  },

  {
    title: "Payments",
    icon: "💳",

    children: [
      {
        title: "All Payments",
        path: "/admin/payments",
      },

      {
        title: "Pending Verification",
        path: "/admin/payments/pending",
      },
    ],
  },

  {
    title: "Users",
    icon: "👥",

    children: [
      {
        title: "All Users",
        path: "/admin/users",
      },

      {
        title: "Admins",
        path: "/admin/admins",
      },
    ],
  },

  {
    title: "Coupons",
    icon: "🏷",

    path: "/admin/coupons",
  },

  {
    title: "Discounts",
    icon: "🔥",

    path: "/admin/discounts",
  },

  {
    title: "Notifications",
    icon: "🔔",

    path: "/admin/notifications",
  },

  {
    title: "CMS Settings",
    icon: "⚙",

    children: [
      {
        title: "Social Links",
        path: "/admin/settings/socials",
      },

      {
        title: "Payment Methods",
        path: "/admin/settings/payments",
      },

      {
        title: "Delivery Charges",
        path: "/admin/settings/delivery",
      },

      {
        title: "Support Information",
        path: "/admin/settings/support",
      },
    ],
  },

  {
    title: "Profile",
    icon: "👤",

    path: "/admin/profile",
  },
];