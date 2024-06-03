import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function RestrictedRoute() {
  const { currentUser } = useSelector((state) => state.user);
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  return currentUser && currentUser.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
}
