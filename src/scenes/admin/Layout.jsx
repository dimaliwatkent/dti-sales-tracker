import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useSelector } from "react-redux";

const Layout = () => {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <div className="flex">
      <Sidebar />
      <div className="container">
        <Navbar user={user || {}} />
        <Outlet />
      </div>
      <div className="absolute right-2 bottom-2"></div>
    </div>
  );
};

export default Layout;
