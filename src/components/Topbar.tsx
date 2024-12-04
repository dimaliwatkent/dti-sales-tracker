import { useLocation, useNavigate } from "react-router-dom";
import {
  adminSidebarItems,
  sidebarItems,
  monitorSidebarItems,
} from "@/constants";
import SignOut from "@/features/auth/SignOut";
import { roleMap } from "@/constants";

import { ChevronLeft } from "lucide-react";

import { Path } from "react-router-dom";
import { SidebarItem } from "@/types/OtherTypes";
import ProfileSidebar from "@/features/profile/ProfileSidebar";
import { Separator } from "./ui/separator";

import { useUserData } from "@/hooks/dataHooks";
import NotificationButton from "@/features/notification/NotificationButton";

const Topbar = (): JSX.Element => {
  const user = useUserData();
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

  const handleProfileClick = () => {
    role === "admin"
      ? navigate("/admin/profile")
      : role === "monitor"
        ? navigate("/monitor/profile")
        : navigate("/profile");
  };

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
        <div className="flex items-center space-x-4">
          <div
            onClick={handleProfileClick}
            className="flex items-center space-x-4"
          >
            {user?.picture ? (
              <div className="aspect-square h-8 rounded-full overflow-hidden">
                <img
                  src={user?.picture}
                  alt="profile-picture"
                  className="object-cover h-full w-full"
                />
              </div>
            ) : (
              <div className="bg-gray-800 w-8 h-8 rounded-full"></div>
            )}
            <div>
              <p className="font-bold">{user?.name}</p>
              <p className="leading-none text-xs">
                {roleMap[user?.role ?? ""] || "Unknown Role"}
              </p>
            </div>
          </div>

          <div>
            <NotificationButton />
          </div>
          <Separator
            orientation="vertical"
            className="py-4 w-[2px] bg-primary "
          />
          <div>{user?._id && <SignOut id={user._id} />}</div>
        </div>
      </div>

      <div className="mobile block md:hidden">
        <div className="flex gap-6 items-center">
          <NotificationButton />
          <ProfileSidebar />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
