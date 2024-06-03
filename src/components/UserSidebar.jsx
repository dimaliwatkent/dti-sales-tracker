import { useEffect, useState } from "react";
import { userSidebarItems } from "@/constants";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/dti-logo.png";

const UserSidebar = () => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");

  useEffect(() => {
    const matchingItem = userSidebarItems.find((item) =>
      pathname.startsWith(item.path),
    );
    if (matchingItem) {
      setActive(matchingItem.text.toLowerCase());
    } else {
      setActive("");
    }
  }, [pathname]);
  return (
    <div className="px-4 border-r w-64 min-h-svh rounded-tr-3xl">
      <div className="flex gap-2 my-4">
        <div className="bg-white flex items-center justify-center rounded-md">
          <img src={logo} className="h-6 m-1" />
        </div>

        <div>
          <p className="text-sm font-bold">SALES TRACKER</p>
          <p className="text-xs">DTI-Marinduque</p>
        </div>
      </div>
      <div className="h-10" />
      <div>
        {userSidebarItems.map((item) => {
          const lcText = item.text.toLowerCase();
          return (
            <Link
              to={item.path}
              key={item.text}
              className={
                active === lcText
                  ? "bg-secondary flex gap-2 my-4 py-1 px-4 rounded-full"
                  : "flex gap-2 my-4 py-1 px-4"
              }
              onClick={() => {
                setActive(lcText);
              }}
            >
              <item.icon size={24} />
              <span>{item.text}</span>
            </Link>
          );
        })}
      </div>
      <div></div>
    </div>
  );
};

export default UserSidebar;
