export const listSidebarItem = {
  overview: [
    {
      title: "dashboard",
      url: "/dashboard",
      icon: "bxs-dashboard",
    },
    {
      title: "analytics",
      url: "/dashboard/analytics",
      icon: "bx-bar-chart",
    },
  ],
  management: [
    {
      title: "products",
      url: "/dashboard/products",
      icon: "bxs-box",
    },
    {
      title: "categories",
      url: "/dashboard/categories",
      icon: "bxs-category",
    },
    {
      title: "inventory",
      url: "/dashboard/inventory",
      icon: "bxs-cube",
    },
    {
      title: "orders",
      url: "/dashboard/orders",
      icon: "bxs-cart",
    },
  ],
  settings: [
    {
      title: "users",
      url: ["/dashboard/users", "/dashboard/users/archived-users"],
      icon: "bxs-group",
      hasSubMenu: true,
      subMenu: [
        {
          title: "manage users",
          url: "/dashboard/users",
        },
        {
          title: "archived users",
          url: "/dashboard/users/archived-users",
        },
      ],
    },
    {
      title: "customer support",
      url: "/dashboard/support",
      icon: "bxs-message-detail",
    },
    {
      title: "blog",
      url: "/dashboard/blog",
      icon: "bxs-pencil",
    },
    {
      title: "pages",
      url: "/dashboard/pages",
      icon: "bxs-file",
    },
    {
      title: "site settings",
      url: "/dashboard/settings",
      icon: "bxs-cog",
    },
    {
      title: "security",
      url: "/dashboard/security",
      icon: "bxs-lock-alt",
    },
  ],
};

export const listSidebarSettingsItem = {
  general_settings: [
    {
      title: "profile",
      url: ["/settings/profile", "/settings"],
      icon: "bxs-user",
    },
    {
      title: "Account",
      url: "/settings/account",
      icon: "bxs-user-detail",
    },
    {
      title: "Appearance",
      url: "/settings/appearance",
      icon: "bxs-paint",
    },
    {
      title: "Notifications",
      url: "/settings/notifications",
      icon: "bxs-bell",
    },
  ],
};

export const listBarProduct = {};
