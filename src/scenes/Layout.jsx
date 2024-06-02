import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useGetUserQuery } from "@/services/api";
import { useSelector } from "react-redux";

const Layout = () => {
  const userId = useSelector((state) => state.global.userId);
  const data = useGetUserQuery(userId);
  const user = data.data;
  return (
    <div className="flex">
      <Sidebar />
      <div className="container">
        <Navbar user={user || {}} />
        <Outlet />
      </div>
      <div className="absolute right-2 bottom-2">
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Layout;
