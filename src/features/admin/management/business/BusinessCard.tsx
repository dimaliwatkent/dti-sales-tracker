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

interface BusinessCardProps {
  business: Business;
  type: string;
}

const BusinessCard = ({ business, type }: BusinessCardProps) => {
  const handleBusinessClick = (business: Business) => {
    navigate("/admin/management/view-business");
    dispatch(setActiveBusiness(business));
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div>
      <Card className={`${business.isArchived ? "opacity-30" : ""} p-6`}>
        <div className="flex items-center gap-4">
          <div className="aspect-square h-20 bg-secondary rounded-lg" />
          <p className="font-bold text-lg">{business.name}</p>
        </div>

        <Separator className="my-2 mt-4 mb-4" />
        <div className="flex flex-col gap-2 text-primary/70">
          <div className="flex items-center gap-2 ">
            <UserIcon size={16} />
            <p className="">{business.user.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <MapPinHouse size={16} />
            <p className="">{business.address}</p>
          </div>
          <div className="flex items-center gap-2">
            <ChartBarBig size={16} />
            <p className="">{business.applicationStatus}</p>
          </div>
        </div>
        <div
          className={`${type === "regular" ? "hidden" : ""} mt-4 flex gap-2 items-center`}
        >
          <Button onClick={() => handleBusinessClick(business)}>View</Button>

          {type === "applicant" ? (
            <div className="flex gap-2 items-center">
              <ApproveBusiness business={business} />
              <ForCompletionBusiness business={business} />
              <RejectBusiness business={business} />
            </div>
          ) : (
            ""
          )}
          {type === "forcompletion" ? (
            <div className="flex gap-2 items-center">
              <ApproveBusiness business={business} />
              <RejectBusiness business={business} />
            </div>
          ) : (
            ""
          )}
        </div>
      </Card>
    </div>
  );
};

export default BusinessCard;
