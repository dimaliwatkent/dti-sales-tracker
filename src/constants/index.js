import {
  LayoutDashboard,
  FileBarChart,
  BookUser,
  NotebookPen,
} from "lucide-react";

export const sidebarItems = [
  {
    text: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    text: "Records",
    icon: FileBarChart,
    path: "/records",
  },
  {
    text: "Exhibitors",
    icon: BookUser,
    path: "/exhibitors",
  },
  {
    text: "Registrations",
    icon: NotebookPen,
    path: "/registrations",
  },
];
