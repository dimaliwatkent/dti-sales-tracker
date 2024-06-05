import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { userSidebarItems } from "@/constants";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { signOut } from "@/services/userSlice";

const UserNavbar = ({ user }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const matchingItem = userSidebarItems.find((item) =>
    pathname.startsWith(item.path),
  );

  const handleSignOut = async () => {
    try {
      await fetch(
        "https://dti-sales-tracker.netlify.app/.netlify/functions/api/auth/signout",
      );
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`flex justify-between w-full py-4`}>
      <div>
        <h1 className="font-bold text-2xl">
          {matchingItem ? matchingItem.text : pathname}
        </h1>
      </div>

      <div className="flex gap-4 items-center">
        <div className="bg-gray-800 w-8 h-8 rounded-sm"></div>
        <div className="border-0">
          <p className="font-bold">{user.name}</p>
          <p className="leading-none text-xs">{user.role}</p>
        </div>
        <div className="h-full bg-primary w-0.5 rounded-full"></div>
        <div>
          <span onClick={handleSignOut}>
            <LogOut />
          </span>
        </div>
      </div>
    </div>
  );
};

UserNavbar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
};

export default UserNavbar;
