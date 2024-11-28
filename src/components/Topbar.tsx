import { useLocation, useNavigate } from "react-router-dom";
import {
  adminSidebarItems,
  sidebarItems,
  monitorSidebarItems,
} from "@/constants";
import SignOut from "@/features/auth/SignOut";
import { roleMap } from "@/constants";

import { ChevronLeft } from "lucide-react";

import { User } from "@/types/UserType";
import { Path } from "react-router-dom";
import { SidebarItem } from "@/types/OtherTypes";
import ProfileSidebar from "@/features/user/profile/ProfileSidebar";
import { Separator } from "./ui/separator";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/api/auth/authSlice";

const Topbar = (): JSX.Element => {
  const user: User = useSelector(selectCurrentUser);
  const role = user?.role;
  const { pathname }: Path = useLocation();
  const navigate = useNavigate();

  const sidebarItemsToUse: SidebarItem[] =
    role === "admin"
      ? adminSidebarItems
      : role === "monitor"
        ? monitorSidebarItems
        : sidebarItems;

  const matchingItem: SidebarItem | undefined = sidebarItemsToUse.find((item) =>
    pathname.startsWith(item.path),
  );

  return (
    <div className="flex justify-between w-full py-4">
      <div className="flex gap-2 items-center">
        <div onClick={() => navigate(-1)}>
          <ChevronLeft />
        </div>
        <h1 className="font-bold text-2xl">
          {matchingItem ? matchingItem.text : pathname.split("/").pop()}
        </h1>
      </div>

      <div className="hidden md:block">
        <div className="flex items-center">
          <div className="bg-gray-800 w-8 h-8 rounded-sm mr-2"></div>
          <div className="border-0 mr-6">
            <p className="font-bold">{user?.name}</p>
            <p className="leading-none text-xs">
              {roleMap[user?.role ?? ""] || "Unknown Role"}
            </p>
          </div>
          <Separator
            orientation="vertical"
            className="py-4 w-[2px] bg-primary mr-2"
          />
          <div>{user?._id && <SignOut id={user._id} />}</div>
        </div>
      </div>

      <div className="mobile block md:hidden">
        <ProfileSidebar />
      </div>
    </div>
  );
};

export default Topbar;
