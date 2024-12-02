import { useActiveBusinessData } from "@/hooks/dataHooks";
import BusinessProfile from "./BusinessProfile";
import UserProfile from "@/features/profile/UserProfile";

const ViewBusiness = () => {
  const business = useActiveBusinessData();
  const user = business.user;

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 pb-32">
        <div className="w-full  md:w-4/12">
          <UserProfile user={user} />
        </div>
        <div className="w-full">
          <BusinessProfile business={business} />
        </div>
      </div>
    </div>
  );
};

export default ViewBusiness;
