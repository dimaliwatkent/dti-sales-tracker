import { useGetBusinessListViolationQuery } from "@/api/violation/violationApiSlice";
import SpinnerText from "@/components/SpinnerWithText";
import { Button } from "@/components/ui/button";
import { BusinessListViolationType } from "@/types/BusinessType";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EventViolation = () => {
  const { id } = useParams();

  const {
    data: businessListData,
    isLoading: isBusinessListLoading,
    // refetch: refetchBusinessList,
  } = useGetBusinessListViolationQuery(id);

  const [businessList, setBusinessList] = useState<BusinessListViolationType[]>(
    [],
  );

  useEffect(() => {
    if (
      businessListData?.businessList &&
      businessListData?.businessList.length > 0
    ) {
      setBusinessList(businessListData?.businessList);
    }
  }, [businessListData]);

  const navigate = useNavigate();

  const handleViolationClick = (id: string) => {
    navigate(`/admin/management/violation/view-violation/${id}`);
  };

  if (isBusinessListLoading) {
    return (
      <div>
        <SpinnerText spin={isBusinessListLoading} />
      </div>
    );
  }

  return (
    <div>
      <div>
        <p className="text-xl font-bold pb-6">Violators</p>
      </div>
      <div className="flex flex-col gap-4">
        {businessList && businessList.length > 0 ? (
          businessList.map((business) => (
            <div key={business._id} className="border p-6 rounded-lg">
              <div className="space-y-4">
                <p className="text-lg font-bold">{business.name}</p>
                <p className="">Booth Number: {business.boothNumber}</p>
                <p className="">
                  Number of Violations: {business.violationList.length}
                </p>
                <Button onClick={() => handleViolationClick(business._id)}>
                  Violations
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div>No businesses with violations found.</div>
        )}
      </div>
    </div>
  );
};

export default EventViolation;
