import { Business } from "@/types/BusinessType";
import ApproveBusiness from "./ApproveBusiness";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { User as UserIcon, MapPinHouse, ChartBarBig } from "lucide-react";

import { setActiveBusiness } from "@/api/business/businessSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import RejectBusiness from "./RejectBusiness";
import ForCompletionBusiness from "./ForCompletionBusiness";
import { useUserData } from "@/hooks/dataHooks";

interface BusinessCardProps {
  business: Business;
  type: string;
}

const BusinessCard = ({ business, type }: BusinessCardProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useUserData();
  const role = user.role;

  const handleBusinessClick = (business: Business) => {
    if (role === "admin") {
      navigate("/admin/management/view-business");
    } else if (role === "user") {
      navigate("/events/business/view-business");
    }
    dispatch(setActiveBusiness(business));
  };

  const handleViolationClick = () => {
    if (role === "admin") {
      navigate("/admin/management/violation/view-violation");
    } else if (role === "user") {
      navigate("/events/violation/view-violation");
    }
    dispatch(setActiveBusiness(business));
  };

  return (
    <div>
      <Card className={`${business.isArchived ? "opacity-30" : ""} p-6`}>
        <div className="flex items-center gap-4">
          {business.logo ? (
            <div className="aspect-square h-20 rounded-lg overflow-hidden">
              <img
                src={business.logo}
                alt="profile-picture"
                className="object-cover h-full w-full"
              />
            </div>
          ) : (
            <div className="aspect-square h-20 bg-secondary rounded-lg" />
          )}
          <div>
            <p className="font-bold text-lg mb-2">{business.name}</p>
            <div>
              <p className="text-md text-[hsl(var(--chart-1))]">
                {business.boothNumber}
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-2 mt-4 mb-4" />
        <div className="flex flex-col gap-2 text-primary/70">
          {business.user.name && (
            <div className="flex items-center gap-2 ">
              <UserIcon size={16} />
              <p className="">{business.user.name}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <MapPinHouse size={16} />
            <p className="">{business.address}</p>
          </div>
          <div className="flex items-center gap-2">
            <ChartBarBig size={16} />
            <p className="">{business.applicationStatus}</p>
          </div>
        </div>
        <div className={` mt-4 flex gap-2 items-center`}>
          <Button onClick={() => handleBusinessClick(business)}>View</Button>

          {type !== "regular" && (
            <div className="flex gap-2 items-center">
              {type === "applicant" ? (
                <>
                  <ApproveBusiness business={business} />
                  <ForCompletionBusiness business={business} />
                  <RejectBusiness business={business} />
                </>
              ) : type === "forcompletion" ? (
                <>
                  <ApproveBusiness business={business} />
                  <RejectBusiness business={business} />
                </>
              ) : null}
            </div>
          )}
          {business.applicationStatus === "approved" && (
            <div>
              <Button onClick={handleViolationClick}>Violations</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BusinessCard;
