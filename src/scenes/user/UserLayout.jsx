import UserSidebar from "@/components/UserSidebar";
import UserNavbar from "@/components/UserNavbar";
import { Outlet } from "react-router-dom";
import ThemeSwitcher from "@/components/ThemeSwitcher";
// import { useGetUserQuery } from "@/services/api";
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
      <div className="absolute right-2 bottom-2">
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default UserLayout;
