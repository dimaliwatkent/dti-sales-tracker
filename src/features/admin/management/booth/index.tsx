import { useEffect, useState } from "react";
import BoothForm from "./BoothForm";
import BoothList from "./BoothList";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  useGetBoothQuery,
  useUpdateBoothMutation,
} from "@/api/booth/boothApiSlice";
import { BoothType, EventBoothType } from "@/types/BoothType";

import { useParams } from "react-router-dom";
import SpinnerText from "@/components/SpinnerWithText";

const Booth = () => {
  const { id } = useParams();

  const { data: eventBoothData, isLoading: isEventBoothLoading } =
    useGetBoothQuery(id);

  const [eventBooth, setEventBooth] = useState<EventBoothType | undefined>(
    undefined,
  );
  const [booths, setBooths] = useState<BoothType[]>([]);
  const { toast } = useToast();
  const [updateBooth, { isLoading }] = useUpdateBoothMutation();

  const handleSaveChanges = async () => {
    try {
      const result = await updateBooth({
        eventId: id,
        boothList: booths,
      }).unwrap();
      toast({
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

  useEffect(() => {
    if (eventBoothData?.event) {
      setEventBooth(eventBoothData?.event);
      setBooths(eventBoothData?.event.boothList);
    }
  }, [eventBoothData]);

  if (isEventBoothLoading) {
    return (
      <div>
        <SpinnerText spin={isEventBoothLoading} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between my-6">
        <p className="text-3xl font-bold ">{eventBooth?.title} Booths</p>
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
          businessList={eventBooth?.businessList}
        />
        <BoothForm booths={booths} setBooths={setBooths} />
      </div>
    </div>
  );
};

export default Booth;
