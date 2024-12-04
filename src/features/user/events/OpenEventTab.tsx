import { Event as EventType } from "@/types/EventType";
import { formatDateTime } from "@/utils/formatTime";
import { eventStatusMap } from "@/constants";

import { Card } from "@/components/ui/card";
import { useOpenEventListData, useUserEventListData } from "@/hooks/dataHooks";
import StatusCard from "./StatusCard";
import useDataLoader from "@/hooks/useDataLoader";
import SpinnerText from "@/components/SpinnerWithText";
import { ScrollArea } from "@/components/ui/scroll-area";

const OpenEventTab = () => {
  const openEventList = useOpenEventListData();
  const userEventList = useUserEventListData();

  const { isLoading } = useDataLoader();

  if (isLoading) {
    return (
      <div>
        <SpinnerText spin={isLoading} />
      </div>
    );
  }

  return (
    <div>
        <ScrollArea className="w-full h-[calc(100vh-180px)] md:h-[calc(100vh-180px)]">

      <div className="flex justify-center my-4">
        <p className="font-bold">Events Open for Application</p>
      </div>
      <div className="grid grid-cols-1 gap-4 pb-32">
        {!openEventList || openEventList.length === 0 ? (
          <div>Currently no events open for application</div>
        ) : (
          openEventList.map((event: EventType) => (
            <div key={event._id}>
              <Card className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold">{event.title}</p>
                </div>
                <div className="flex gap-2">
                  <p className="font-bold">Duration</p>
                  {formatDateTime(event.startDate)} -{" "}
                  {formatDateTime(event.endDate)}
                </div>

                <div className="flex gap-2">
                  <p className="font-bold">Application Duration</p>
                  {formatDateTime(event.applicationStart)} -{" "}
                  {formatDateTime(event.applicationEnd)}
                </div>
                <div className="flex gap-2">
                  <p className="font-bold">Status</p>
                  {eventStatusMap[event.status]}
                </div>
                <div className="flex gap-2">
                  <p className="font-bold">Location</p>
                  {event.location}
                </div>

                <StatusCard
                  business={
                    userEventList.find((e) => e._id === event._id)?.business
                  }
                  event={event}
                />
              </Card>
            </div>
          ))
        )}
      </div>
    
      </ScrollArea>
    </div>
  );
};

export default OpenEventTab;
