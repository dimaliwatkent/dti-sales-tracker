import {
  LayoutDashboard,
  FileBarChart,
  BookUser,
  NotebookPen,
  Store,
  ShoppingBasket,
} from "lucide-react";

export const sidebarItems = [
  {
    text: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    text: "Records",
    icon: FileBarChart,
    path: "/admin/records",
  },
  {
    text: "Exhibitors",
    icon: BookUser,
    path: "/admin/exhibitors",
  },
  {
    text: "Registrations",
    icon: NotebookPen,
    path: "/admin/registrations",
  },
];

export const userSidebarItems = [
  {
    text: "Sales",
    icon: Store,
    path: "/user/sales",
  },
  {
    text: "Records",
    icon: FileBarChart,
    path: "/user/records",
  },
  {
    text: "Products",
    icon: ShoppingBasket,
    path: "/user/products",
  },
];

export default sidebarItems;
