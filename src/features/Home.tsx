import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>Home</div>
      <Button onClick={() => navigate("/signin")}>Sign in</Button>
    </>
  );
};

export default Home;
