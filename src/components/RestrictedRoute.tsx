import { Navigate, Outlet, useLocation } from "react-router-dom";
import { User } from "@/types/UserType";
import { Location } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/api/auth/authSlice";

interface RestrictedRouteProps {
  allowedRoles: string[];
}

const RestrictedRoute = ({
  allowedRoles,
}: RestrictedRouteProps): JSX.Element => {

  const user: User = useSelector(selectCurrentUser);

  const location: Location = useLocation();

  return user && allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default RestrictedRoute;
