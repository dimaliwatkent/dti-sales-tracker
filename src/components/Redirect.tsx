import { Navigate } from "react-router-dom";

import { useUserData } from "@/hooks/dataHooks";
import { User } from "@/types/UserType";

const Redirect = () => {
  const user: User | null = useUserData();
  if (user === null || Object.keys(user).length === 0) {
    return <Navigate to="/signin" />;
  } else if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" />;
  } else if (user?.role === "user") {
    return <Navigate to="/sales" />;
  } else {

    return <Navigate to="/registration" />;
  }
};

export default Redirect;
