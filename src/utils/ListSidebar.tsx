export const listSidebarItem = {
  overview: [
    {
      title: "dashboard",
      url: "/admin",
      icon: "bxs-dashboard",
    },
    {
      title: "analytics",
      url: "/admin/analytics",
      icon: "bx-bar-chart",
    },
  ],
  management: [
    {
      title: "products",
      url: "/admin/products",
      icon: "bxs-box",
      hasSubMenu: true,
      subMenu: [
        {
          title: "flowers",
          url: "/admin/products/flowers",
        },
        {
          title: "bouquet",
          url: "/admin/products/bouquet",
        },
      ],
    },
    {
      title: "categories",
      url: "/admin/categories",
      icon: "bxs-category",
    },
    {
      title: "inventory",
      url: "/admin/inventory",
      icon: "bxs-cube",
    },
    {
      title: "orders",
      url: "/admin/orders",
      icon: "bxs-cart",
    },
  ],
  settings: [
    {
      title: "users",
      url: ["/admin/users", "/admin/users/archived-users"],
      icon: "bxs-group",
      hasSubMenu: true,
      subMenu: [
        {
          title: "manage users",
          url: "/admin/users",
        },
        {
          title: "archived users",
          url: "/admin/users/archived-users",
        },
      ],
    },
    {
      title: "customer support",
      url: "/admin/support",
      icon: "bxs-message-detail",
    },
    {
      title: "blog",
      url: "/admin/blog",
      icon: "bxs-pencil",
    },
    {
      title: "pages",
      url: "/admin/pages",
      icon: "bxs-file",
    },
    {
      title: "site settings",
      url: "/admin/settings",
      icon: "bxs-cog",
    },
    {
      title: "security",
      url: "/admin/security",
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
