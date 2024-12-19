import {
  useGetBusinessViolationQuery,
  useMarkAsPaidMutation,
} from "@/api/violation/violationApiSlice";
import SpinnerText from "@/components/SpinnerWithText";
import { useUserData } from "@/hooks/dataHooks";
import {
  BusinessWithViolation,
  BusinessViolation,
} from "@/types/ViolationType";
import { formatCurrency } from "@/utils/formatCurrency";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/utils/formatTime";

const ViewViolation = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState<BusinessWithViolation>();
  const violationList = business?.violationList;

  const user = useUserData();
  const showButton = user.role === "admin";

  const {
    data: businessData,
    isLoading: isBusinessLoading,
    refetch: refetchBusiness,
  } = useGetBusinessViolationQuery(id);

  useEffect(() => {
    if (businessData?.business) {
      setBusiness(businessData?.business);
    }
  }, [businessData]);

  const [markAsPaid, { isLoading: isLoadingMark }] = useMarkAsPaidMutation();
  const { toast } = useToast();

  if (isBusinessLoading || isLoadingMark) {
    return (
      <div>
        <SpinnerText spin={isBusinessLoading} />
      </div>
    );
  }

  const handleMarkAsPaid = async (violationId?: string) => {
    try {
      const result = await markAsPaid({
        businessId: id,
        violationIds: violationId
          ? [violationId]
          : violationList
              ?.filter((violation: BusinessViolation) => violation.count > 2)
              .map((violation: BusinessViolation) => violation._id),
      }).unwrap();

      toast({
        variant: "default",
        title: "Success",
        description: result.message,
      });
    } catch (error: unknown) {
      if (error) {
        toast({
          variant: "destructive",
          title: (error as { data: { message: string } }).data.message,
          description: (error as { data: { err: string } }).data.err,
        });
      }
    }
  };

  const calculateTotalFine = () => {
    let totalFine = 0;
    violationList?.forEach((violation: BusinessViolation) => {
      if (violation.count > 2 && !violation.isPaid) {
        totalFine += violation.violation.fee * violation.count;
      }
    });
    return totalFine;
  };

  const warningLevels: { [key: number]: { level: string; color: string } } = {
    1: { level: "First Warning", color: "text-[hsl(var(--chart-2))]" },
    2: { level: "Second Warning", color: "text-[#DDAC11] dark:text-[#F2C026]" },
    3: { level: "Penalty", color: "text-destructive dark:text-[#D62E2E]" },
  };

  return (
    <div className="border rounded-lg p-6">
      <div className="flex flex-col md:flex-row items-center gap-4">
        {business?.logo ? (
          <div className="aspect-square h-16 rounded-lg overflow-hidden">
            <img
              src={business?.logo}
              alt="profile-picture"
              className="object-cover h-full w-full"
            />
          </div>
        ) : (
          <div className="aspect-square h-14 bg-secondary rounded-lg" />
        )}
        <div>
          <div className="flex items-center gap-4 mb-4 ">
            <p className="text-xl font-bold ">{business?.name}</p>

            <div className="bg-gray-200 dark:bg-gray-800 px-2 rounded-full">
              <p className="text-sm">{business?.boothNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />
      <div className="flex justify-between">
        <p className="text-xl font-bold pb-4">Violations</p>
        <div className="flex gap-2">
          <Button onClick={() => refetchBusiness()}>Refresh</Button>
          {showButton && (
            <Button onClick={() => handleMarkAsPaid()}>Mark All As Paid</Button>
          )}
        </div>
      </div>

      {violationList && violationList.length > 0 && (
        <div className="flex gap-2 pb-4 ">
          <p className="text-lg ">Total Fine</p>
          <p className="text-lg font-bold">
            {" "}
            {formatCurrency(calculateTotalFine())}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {violationList && violationList.length > 0 ? (
          violationList.map((violation: BusinessViolation) => (
            <div key={violation._id} className="bg-secondary p-4 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p>{violation.violation.name}</p>
                  <div>
                    <p className={`${warningLevels[violation.count]?.color}`}>
                      {warningLevels[violation.count]?.level || "Penalty"}{" "}
                      {violation.count > 2
                        ? `(Penalty: ${violation.violation.fee * violation.count})`
                        : ""}
                    </p>
                  </div>
                  <p>
                    Date:{" "}
                    <span className="font-bold">
                      {formatDateTime(violation.updatedAt)}
                    </span>
                  </p>
                  <p>
                    Monitor:{" "}
                    <span className="font-bold">{violation.monitor.name}</span>
                  </p>
                  {violation.count > 2 && (
                    <p>
                      Reason:{" "}
                      <span className="font-bold">{violation.message}</span>
                    </p>
                  )}
                </div>
                <div>
                  {violation.count > 2 &&
                    (violation.isPaid ? (
                      <p>Paid</p>
                    ) : (
                      showButton && (
                        <Button onClick={() => handleMarkAsPaid(violation._id)}>
                          Mark As Paid
                        </Button>
                      )
                    ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Currently no violations</div>
        )}
      </div>
    </div>
  );
};

export default ViewViolation;
