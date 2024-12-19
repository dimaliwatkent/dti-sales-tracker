import { BusinessType } from "@/types/BusinessType";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { User as UserIcon, MapPinHouse, ChartBarBig } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useUserData } from "@/hooks/dataHooks";

interface BusinessCardProps {
  business: BusinessType;
  type: string;
}

const BusinessCard = ({ business, type }: BusinessCardProps) => {
  const navigate = useNavigate();
  const user = useUserData();
  const role = user.role;

  const handleBusinessClick = (business: BusinessType) => {
    if (role === "admin") {
      navigate(`/admin/management/view-business/${business._id}/${type}`);
    } else if (role === "user") {
      navigate(`/events/business/view-business/${business._id}`);
    }
  };

  const handleViolationClick = () => {
    if (role === "admin") {
      navigate(`/admin/management/violation/view-violation/${business?._id}`);
    } else if (role === "user") {
      navigate(`/events/violation/view-violation/${business?._id}`);
    }
  };

  return (
    <div>
      <Card className={" p-6"}>
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
