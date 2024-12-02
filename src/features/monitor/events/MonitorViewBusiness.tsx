import {
  selectMonitorBusiness,
  setMonitorBusiness,
} from "@/api/business/businessSlice";
import useDataLoader from "@/hooks/useDataLoader";
import { useDispatch, useSelector } from "react-redux";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

import { violationList } from "@/constants";
import { useUserData } from "@/hooks/dataHooks";
import { useAddViolationMutation } from "@/api/violation/violationApiSlice";

import { Violation as ViolationType } from "@/types/ViolationType";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";

const MonitorViewBusiness = () => {
  const business = useSelector(selectMonitorBusiness);
  const businessViolations = business.violationList;
  const { refetchMonitorEventList } = useDataLoader();
  const monitor = useUserData();
  const [addViolation] = useAddViolationMutation();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [loadingButton, setLoadingButton] = useState("");

  const handleAddViolation = async (violation: ViolationType) => {
    setLoadingButton(violation.name);
    try {
      const result = await addViolation({
        businessId: business._id,
        violation: { ...violation, monitor: monitor._id },
      }).unwrap();

      toast({
        variant: "default",
        title: "Success",
        description: result.message,
      });

      refetchMonitorEventList();
      dispatch(setMonitorBusiness(result.business));
      setLoadingButton("");
    } catch (error: unknown) {
      if (error) {
        toast({
          variant: "destructive",
          title: (error as { data: { message: string } }).data.message,
          description: (error as { data: { err: string } }).data.err,
        });
      }
      setLoadingButton("");
    }
  };

  return (
    <div>
      <div>
        <div className="flex justify-center">
          <p className="text-xl font-bold">{business.name}</p>
        </div>
        <ScrollArea className="w-full h-[calc(100vh-230px)] md:h-[calc(100vh-150px)]">
          <div className="flex flex-col gap-4">
            {violationList.map((violation) => {
              const businessViolation = businessViolations.find(
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
                    <Button
                      onClick={() => handleAddViolation(violation)}
                      disabled={loadingButton === violation.name}
                    >
                      {loadingButton === violation.name
                        ? "Loading..."
                        : warningCount >= 2
                          ? "Penalty"
                          : "Warning"}
                    </Button>
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
