import React from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { sidebarItems } from "@/constants";
import { LogOut } from "lucide-react";

const Navbar = ({ user }) => {
  const { pathname } = useLocation();
  const matchingItem = sidebarItems.find((item) =>
    pathname.startsWith(item.path),
  );

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
          <LogOut />
        </div>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
};

export default Navbar;
