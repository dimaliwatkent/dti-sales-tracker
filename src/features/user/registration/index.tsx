import { useUserData } from "@/hooks/dataHooks";
import useInterval from "@/hooks/useInterval";
import { useGetUserQuery } from "@/api/user/userApiSlice";
import { useToast } from "@/components/ui/use-toast";
import { intervalTime } from "@/constants";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const user = useUserData();
  const { data, refetch } = useGetUserQuery(user._id);
  const newUserRole = data?.user?.role;
  const { toast } = useToast();
  const navigate = useNavigate();

  useInterval(() => {
    if (newUserRole === "newUser") {
      refetch();
      console.log("interval refetch");
    } else if (newUserRole === "rejected") {
      return;
    } else {
      toast({
        variant: "default",
        title: "Success",
        description: "Account has been approved. Please Sign In again",
      });
    }
  }, intervalTime.accountRegistration);

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center mt-6">
        <p className="text-2xl font-bold mb-4">Welcome to Expo Track!</p>
        <p className="text-xl font-bold mb-4">Account Registration</p>
        <div className="flex flex-col items-center justify-center text-primary/70">
          {newUserRole === "rejected" ? (
            <p className="text-destructive">
              Your registration has been rejected.
            </p>
          ) : newUserRole === "newUser" ? (
            <p>
              Your account registration has been received. Please wait for
              confirmation.
            </p>
          ) : (
            <div className="flex flex-col items-center ">
              <p>Your account registration has been approved.</p>
              <p className="pb-2">
                For a seamless experience, please sign in again to update your
                account status.
              </p>
              <Button onClick={() => navigate("/signin")}>Go to Sign In</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registration;
