import {
  DashboardIcon,
  BarChartIcon,
  GearIcon,
  ClipboardIcon,
  CalendarIcon,
  AvatarIcon,
  BellIcon,
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
  {
    text: "Notifications",
    icon: BellIcon,
    path: "/admin/notification",
  },
  {
    text: "Profile",
    icon: AvatarIcon,
    path: "/admin/profile",
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
    text: "Events",
    icon: CalendarIcon,
    path: "/events",
  },
  {
    text: "Registration",
    icon: CalendarIcon,
    path: "/registration",
  },
  {
    text: "Notifications",
    icon: BellIcon,
    path: "/notification",
  },
  {
    text: "Profile",
    icon: AvatarIcon,
    path: "/profile",
  },
];

const monitorSidebarItems: SidebarItem[] = [
  {
    text: "Events",
    icon: CalendarIcon,
    path: "/monitor/events",
  },
  {
    text: "Info",
    icon: GearIcon,
    path: "/monitor/info",
  },
  {
    text: "Registration",
    icon: CalendarIcon,
    path: "/registration",
  },
  {
    text: "Notifications",
    icon: BellIcon,
    path: "/monitor/notification",
  },
  {
    text: "Profile",
    icon: AvatarIcon,
    path: "/monitor/profile",
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
  completed: "Completed",
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
  notification: 600, // seconds
};

export {
  adminSidebarItems,
  sidebarItems,
  monitorSidebarItems,
  roleMap,
  eventStatusMap,
  applicationStatusMap,
  intervalTime,
};
