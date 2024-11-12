import {
  DashboardIcon,
  BarChartIcon,
  GearIcon,
  ClipboardIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";
import { SidebarItem } from "@/types/OtherTypes";

const adminSidebarItems: SidebarItem[] = [
  {
    text: "Dashboard",
    icon: DashboardIcon,
    path: "/admin/dashboard",
  },
  {
    text: "Records",
    icon: BarChartIcon,
    path: "/admin/records",
  },
  {
    text: "Management",
    icon: GearIcon,
    path: "/admin/management",
  },
  {
    text: "Registrations",
    icon: ClipboardIcon,
    path: "/admin/registrations",
  },
];

const sidebarItems: SidebarItem[] = [
  {
    text: "Sales",
    icon: DashboardIcon,
    path: "/sales",
  },
  // {
  //   text: "Records",
  //   icon: BarChartIcon,
  //   path: "/records",
  // },
  {
    text: "Products",
    icon: GearIcon,
    path: "/products",
  },
  {
    text: "Events",
    icon: CalendarIcon,
    path: "/events",
  },
  {
    text: "Registration",
    icon: CalendarIcon,
    path: "/registration",
  },
];

const roleMap: { [key: string]: string } = {
  admin: "Admin",
  user: "User",
  newUser: "Pending",
  monitor: "Monitoring Staff",
};

const eventStatusMap: { [key: string]: string } = {
  applicationOpen: "Open for Application",
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Monitoring Staff",
  cancelled: "Cancelled",
  postponed: "Postponed",
};

const applicationStatusMap: { [key: string]: string } = {
  forcompletion: "For Completion",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  complied: "Complied",
};

const intervalTime = {
  adminDashboard: 60, // seconds
  adminRecords: 60, // seconds
  adminRegistration: 60, // seconds
  adminManagement: 60, // seconds
  adminViewEvent: 60, // seconds
  userEvent: 60, // seconds
  accountRegistration: 60, // seconds
};

export {
  adminSidebarItems,
  sidebarItems,
  roleMap,
  eventStatusMap,
  applicationStatusMap,
  intervalTime,
};
