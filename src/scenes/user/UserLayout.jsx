import UserSidebar from "@/components/UserSidebar";
import UserNavbar from "@/components/UserNavbar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const UserLayout = () => {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <div className="flex">
      <UserSidebar />
      <div className="container">
        <UserNavbar user={user || {}} />
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
