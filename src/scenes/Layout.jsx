import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const data = {
  _id: "63701cc1f03239c72c00017f",
  name: "Konstantine",
  email: "kranstead0@narod.ru",
  password: "omMDCh",
  city: "Nurabelen",
  state: null,
  country: "ID",
  occupation: "Computer Systems Analyst I",
  phoneNumber: "8346315874",
  transactions: [
    "63701d74f0323986f3000158",
    "63701d74f03239d40b00007e",
    "63701d74f03239867500014b",
    "63701d74f032398675000152",
  ],
  role: "administrator",
};

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="container">
        <Navbar user={data || {}} />
        <Outlet />
      </div>
      <div className="absolute right-2 bottom-2">
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Layout;
