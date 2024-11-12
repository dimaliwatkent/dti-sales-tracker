import { useEffect, useState } from "react";
import { adminSidebarItems, sidebarItems } from "@/constants";
import { Link, useLocation } from "react-router-dom";
import logo from "/dti-logo.png";
import { useUserData } from "@/hooks/dataHooks";

import { ModeToggle } from "./mode-toggle";

const Navbar = (): JSX.Element => {
  const { pathname } = useLocation();
  const [activeItem, setActiveItem] = useState("");
  const status = useUserData()?.role;

  useEffect(() => {
    const sidebarItemsToUse =
      status === "admin" ? adminSidebarItems : sidebarItems;
    const matchingItem = sidebarItemsToUse.find((item) =>
      pathname.startsWith(item.path),
    );
    setActiveItem(matchingItem ? matchingItem.text.toLowerCase() : "");
  }, [status, pathname]);

  return (
    <div>
      <div className="hidden md:block px-4 border-r h-screen rounded-tr-3xl ">
        <div className="flex gap-2 py-4">
          <div className="bg-white flex items-center justify-center rounded-md">
            <img src={logo} className="h-6 m-1" />{" "}
          </div>
          <div>
            <p className="text-sm font-bold">EXPO TRACK</p>
            <p className="text-xs">DTI-Marinduque</p>
          </div>
        </div>
        <div className="h-10" />
        <div>
          {(status === "admin" ? adminSidebarItems : sidebarItems).map(
            (item) => {
              const lowercaseText = item.text.toLowerCase();

              const isHidden: boolean =
                ((status === "admin" || status === "user") &&
                  item.path === "/registration") ||
                ((status === "pendingUser" || status === "newUser") &&
                  item.path !== "/registration");

              return (
                <Link
                  to={item.path}
                  key={item.text}
                  className={`${
                    activeItem === lowercaseText && "bg-secondary  rounded-full"
                  } items-center flex gap-2 my-4 py-1 px-4 ${isHidden ? "hidden" : ""} `}
                  onClick={() => {
                    setActiveItem(lowercaseText);
                  }}
                >
                  <item.icon />
                  <span>{item.text}</span>
                </Link>
              );
            },
          )}
        </div>

        <div className="z-50 fixed left-2 bottom-2 hidden md:block">
          <ModeToggle />
        </div>
      </div>

      <div className="mobile block md:hidden border rounded-xl bg-background">
        <div className="flex justify-evenly">
          {(status === "admin" ? adminSidebarItems : sidebarItems).map(
            (item) => {
              const lowercaseText = item.text.toLowerCase();

              const isHidden: boolean =
                ((status === "admin" || status === "user") &&
                  item.path === "/registration") ||
                ((status === "pendingUser" || status === "newUser") &&
                  item.path !== "/registration");

              return (
                <Link
                  to={item.path}
                  key={item.text}
                  className={`items-center flex flex-col my-2 py-1 px-4 ${
                    activeItem === lowercaseText && " bg-secondary rounded-lg"
                  } ${isHidden ? "hidden" : ""} `}
                  onClick={() => {
                    setActiveItem(lowercaseText);
                  }}
                >
                  <item.icon width={24} height={24} className="m-2" />
                  <p className="text-xs">{item.text}</p>
                </Link>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
