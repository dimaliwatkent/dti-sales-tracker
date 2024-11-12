import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";

const Layout = (): JSX.Element => {
  return (
    <div className="flex flex-col h-screen md:flex-row">
      <div className="z-40 md:order-1 order-1 md:static fixed bottom-0 left-0 w-full md:w-auto">
        <Navbar />
      </div>
      <div className="md:order-2 order-3 w-full container">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
};
export default Layout;
