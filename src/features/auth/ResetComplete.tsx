import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ResetComplete = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-2">
      <p className="font-bold text-xl">Password Reset Complete</p>
      <p>You may now Sign In</p>
      <Button onClick={() => navigate("/signin")}>Go to Sign In</Button>
    </div>
  );
};

export default ResetComplete;
