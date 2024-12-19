import { useUserData } from "@/hooks/dataHooks";
import BusinessProfile from "./BusinessProfile";
import UserProfile from "@/features/profile/UserProfile";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetBusinessQuery } from "@/api/business/businessApiSlice";
import { BusinessType } from "@/types/BusinessType";
import SpinnerText from "@/components/SpinnerWithText";

import ApproveBusiness from "./ApproveBusiness";
import ForCompletionBusiness from "./ForCompletionBusiness";
import RejectBusiness from "./RejectBusiness";

const ViewBusiness = () => {
  const { id, type } = useParams();
  const user = useUserData();
  const [business, setBusiness] = useState<BusinessType>();

  const { data: businessData, isLoading: isBusinessLoading } =
    useGetBusinessQuery(id);

  useEffect(() => {
    if (businessData?.business) {
      setBusiness(businessData?.business);
    }
  }, [businessData]);

  if (isBusinessLoading) {
    return (
      <div>
        <SpinnerText spin={isBusinessLoading} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 pb-32">
        <div className="w-full  md:w-4/12">
          <UserProfile user={user} />
        </div>
        <div className="w-full">
          <BusinessProfile business={business} />

          <div className="w-full flex justify-end mt-4">
            {type !== "regular" && business && (
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBusiness;
