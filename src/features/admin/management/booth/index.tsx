import { useEffect, useState } from "react";
import BoothForm from "./BoothForm";
import BoothList from "./BoothList";
import { useEventData } from "@/hooks/dataHooks";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateBoothMutation } from "@/api/booth/boothApiSlice";
import { BoothType } from "@/types/BoothType";
import useDataLoader from "@/hooks/useDataLoader";

const Booth = () => {
  const event = useEventData();
  const [booths, setBooths] = useState<BoothType[]>([]);
  const { toast } = useToast();
  const [updateBooth, { isLoading }] = useUpdateBoothMutation();
  const { refetchEventList } = useDataLoader();

  const handleSaveChanges = async () => {
    try {
      const result = await updateBooth({
        eventId: event._id,
        boothList: booths,
      }).unwrap();
      toast({
        title: "Success",
        description: result.message,
      });
      refetchEventList();
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

  useEffect(() => {
    if (event.boothList) {
      setBooths(event.boothList);
    }
  }, [event.boothList]);

  return (
    <div>
      <div className="flex items-end justify-between my-6">
        <p className="text-3xl font-bold ">{event.title} Booths</p>
        <Button disabled={isLoading} onClick={handleSaveChanges}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      <div>
        <p className="text-sm mb-2 text-primary/50">
          Make sure to save changes
        </p>
      </div>
      <div className="flex gap-4 ">
        <BoothList
          booths={booths}
          setBooths={setBooths}
          businessList={event.businessList}
        />
        <BoothForm booths={booths} setBooths={setBooths} />
      </div>
    </div>
  );
};

export default Booth;
