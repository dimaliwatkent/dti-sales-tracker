import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  if (!currentUser) {
    return <Navigate to="/signin" />;
  }
  return currentUser && currentUser.role === "user" ? (
    <Outlet />
  ) : (
    <Navigate to="/admin" />
  );
}
