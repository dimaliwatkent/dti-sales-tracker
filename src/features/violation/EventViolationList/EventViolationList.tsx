import { useState, useEffect } from "react";
import Refresh from "@/components/Refresh";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ViolationType } from "@/types/ViolationType";
import SpinnerText from "@/components/SpinnerWithText";
import {
  useDeleteViolationMutation,
  useGetEventViolationQuery,
} from "@/api/violation/violationApiSlice";
import { useParams } from "react-router-dom";
import { formatCurrency } from "@/utils/formatCurrency";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import AddEventViolation from "./AddEventViolation";

const EventViolationList = () => {
  const { id } = useParams();

  const [searchTerm, setSearchTerm] = useState("");

  const [violationList, setViolationList] = useState<ViolationType[]>([]);

  const {
    data: violationListData,
    isLoading: isViolationListLoading,
    refetch: refetchViolationList,
  } = useGetEventViolationQuery(id);

  const [deleteViolation, { isLoading: isLoadingDeleteViolation }] =
    useDeleteViolationMutation();

  const { toast } = useToast();

  useEffect(() => {
    if (violationListData?.violationList) {
      setViolationList(violationListData?.violationList);
    }
  }, [violationListData]);

  const handleDeleteViolation = async (violationId: string) => {
    try {
      const result = await deleteViolation(violationId).unwrap();
      toast({
        title: "Success",
        description: result.message,
      });
      refetchViolationList();
    } catch (error: unknown) {
      if (error) {
        toast({
          variant: "destructive",
          title: (error as { data: { message: string } }).data.message,
          description: (error as { data: { error: string } }).data.error,
        });
      }
    }
  };

  if (isViolationListLoading || isLoadingDeleteViolation) {
    return (
      <div>
        <SpinnerText
          spin={isViolationListLoading || isLoadingDeleteViolation}
        />
      </div>
    );
  }

  return (
    <div>
      <p className="text-xl font-bold">Violations</p>
      <div className="flex py-4 gap-2">
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search violation..."
        />

        <Refresh refetch={refetchViolationList} />
        <AddEventViolation eventId={id || ""} refetch={refetchViolationList} />
      </div>

      <ScrollArea className="w-full h-[calc(100vh-230px)] md:h-[calc(100vh-150px)]">
        <div className="space-y-4 pb-32">
          {violationList &&
            violationList.map((violation) => (
              <div key={violation._id} className="border rounded-lg p-6">
                <div className=" flex justify-between">
                  <div>
                    <p className="font-bold">{violation.name}</p>
                    <p className="">{violation.description}</p>
                  </div>
                  <div>
                    <p>
                      {formatCurrency(violation.fee)}
                      <div className="mt-2 flex justify-end">
                        <Button
                          onClick={() =>
                            handleDeleteViolation(violation._id || "")
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EventViolationList;
