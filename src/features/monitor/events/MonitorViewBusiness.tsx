import { ScrollArea } from "@/components/ui/scroll-area";

// import { violationList } from "@/constants";
import {
  useGetBusinessViolationQuery,
  useGetEventViolationQuery,
} from "@/api/violation/violationApiSlice";

import { BusinessWithViolation, ViolationType } from "@/types/ViolationType";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { useParams } from "react-router-dom";
import SpinnerText from "@/components/SpinnerWithText";
import PenaltyButton from "./PenaltyButton";

const MonitorViewBusiness = () => {
  const { businessId, eventId } = useParams();

  const {
    data: businessData,
    isLoading: isBusinessLoading,
    refetch: refetchBusiness,
  } = useGetBusinessViolationQuery(businessId);

  const [business, setBusiness] = useState<BusinessWithViolation>();

  const [violationList, setViolationList] = useState<ViolationType[]>([]);

  const {
    data: violationListData,
    isLoading: isViolationListLoading,
    // refetch: refetchViolationList,
  } = useGetEventViolationQuery(eventId);

  useEffect(() => {
    if (violationListData?.violationList) {
      setViolationList(violationListData?.violationList);
    }
  }, [violationListData]);

  useEffect(() => {
    if (businessData?.business) {
      setBusiness(businessData?.business);
    }
  }, [businessData]);

  const businessViolations = business?.violationList;

  if (isBusinessLoading || isViolationListLoading) {
    return (
      <div>
        <SpinnerText spin={isBusinessLoading || isViolationListLoading} />
      </div>
    );
  }

  return (
    <div>
      <div>
        <div className="flex justify-center">
          <p className="text-xl font-bold">{business?.name}</p>
        </div>
        <ScrollArea className="w-full h-[calc(100vh-230px)] md:h-[calc(100vh-150px)]">
          <div className="flex flex-col gap-4">
            {violationList &&
              violationList.map((violation) => {
                const businessViolation = businessViolations?.find(
                  (businessViolation) =>
                    businessViolation.violation.name === violation.name,
                );

                let warningCount = 0;
                let penaltyCount = 0;

                if (businessViolation) {
                  if (businessViolation.count <= 2) {
                    warningCount = businessViolation.count;
                  } else {
                    penaltyCount = businessViolation.count - 2;
                    warningCount = 2;
                  }
                }

                return (
                  <div
                    key={violation.name}
                    className="flex justify-between border rounded p-2"
                  >
                    <div>
                      <p className="font-bold text-lg">{violation.name}</p>
                      <p className="text-sm">{violation.description}</p>
                      <p>Fee: {formatCurrency(violation.fee)}</p>
                      <p>Warning Count: {warningCount}</p>
                      <p>Penalty Count: {penaltyCount}</p>
                    </div>
                    <div className="pl-2">
                      <PenaltyButton
                        businessId={business?._id || ""}
                        violation={violation}
                        refetchBusiness={refetchBusiness}
                        type={penaltyCount > 0 ? "Penalty" : "Warning"}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MonitorViewBusiness;
