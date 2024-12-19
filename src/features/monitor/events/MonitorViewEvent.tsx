import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useParams } from "react-router-dom";
import { BusinessListViolationType } from "@/types/BusinessType";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SpinnerText from "@/components/SpinnerWithText";
import { useGetEventWithBusinessQuery } from "@/api/event/eventApiSlice";

const MonitorViewEvent = () => {
  const { id } = useParams();

  const {
    data: businessListData,
    isLoading: isBusinessListLoading,
    // refetch: refetchBusinessList,
  } = useGetEventWithBusinessQuery(id);

  const [businessList, setBusinessList] = useState<BusinessListViolationType[]>(
    [],
  );

  useEffect(() => {
    if (
      businessListData?.event.businessList &&
      businessListData?.event.businessList.length > 0
    ) {
      setBusinessList(businessListData?.event.businessList);
    }
  }, [businessListData]);

  const navigate = useNavigate();

  const handleBusinessClick = (businessId: string) => {
    navigate(`/monitor/events/view-business/${businessId}/${id}`);
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
      <p className="text-3xl font-bold my-6">{businessListData?.eventTitle}</p>
      <div>
        <ScrollArea className="w-full h-[calc(100vh-230px)] md:h-[calc(100vh-150px)]">
          {businessList && businessList.length > 0 ? (
            businessList.map((business) => (
              <div key={business._id}>
                <div className="flex justify-between items-center p-4  border rounded-lg">
                  <p>{business.name}</p>
                  <Button onClick={() => handleBusinessClick(business._id)}>
                    Violations
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div>Currently no business</div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default MonitorViewEvent;
