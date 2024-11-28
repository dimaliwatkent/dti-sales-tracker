import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const UnAuthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-2">
      <p className="font-bold">Unauthorized</p>
      <p>You are not allowed here.</p>
      <Button onClick={() => navigate("/signin")}>Go to Sign In</Button>
    </div>
  );
};

export default UnAuthorized;
