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
};

const violationList = [
  {
    name: "Late Ingress",
    fee: 1000,
    description: "",
  },
  {
    name: "Back-out",
    fee: 1000,
    description: "1-year suspension from Marinduque Expo plus fine",
  },
  {
    name: "Tardiness",
    fee: 100,
    description: "Non-observance of exhibitor hours",
  },
  {
    name: "After 12:00 NN",
    fee: 500,
    description: "Non-observance of exhibitor hours",
  },
  {
    name: "Early Departure/Undertime",
    fee: 100,
    description: "Non-observance of exhibitor hours",
  },
  {
    name: "Unmanned Booth: 1st Offense",
    fee: 500,
    description: "",
  },
  {
    name: "Unmanned Booth: 2nd Offense",
    fee: 1000,
    description: "",
  },
  {
    name: "Closed booth without permission: 1st Offense",
    fee: 500,
    description: "",
  },
  {
    name: "Closed booth without permission: 2nd Offense",
    fee: 1000,
    description: "",
  },
  {
    name: "Non-compliance with dress code",
    fee: 500,
    description: "",
  },
  {
    name: "Early Serving of Alcohol",
    fee: 500,
    description: "",
  },
  {
    name: "Selling Other Products",
    fee: 1000,
    description:
      "Selling products other than those declared in the application by the exhibitor and Selling not a Marinduque product (1-year suspension from Marinduque Expo plus fine)",
  },
  {
    name: "Early Egress",
    fee: 1000,
    description: "1-year suspension from Marinduque Expo plus fine",
  },
  {
    name: "Nonpayment: Electricity Fee",
    fee: 5000,
    description: "",
  },
  {
    name: "Nonpayment: Municipality of Boac",
    fee: 5000,
    description: "",
  },
  {
    name: "Dirty Area",
    fee: 500,
    description: "Dirty dining, back, and sink-no mesh",
  },
  {
    name: "Using Plastic or Styrofoam",
    fee: 500,
    description: "",
  },
  {
    name: "Behaviour-related or Other Admin Concerns",
    fee: 1000,
    description: "",
  },
  {
    name: "Non-observance of Minimum Health Protocol",
    fee: 500,
    description: "",
  },
  {
    name: "Sales Submission",
    fee: 500,
    description: "",
  },
];

export {
  adminSidebarItems,
  sidebarItems,
  monitorSidebarItems,
  roleMap,
  eventStatusMap,
  applicationStatusMap,
  intervalTime,
  violationList,
};
