import { formatDateTime } from "@/utils/formatTime";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { EventShortType } from "@/types/EventType";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetEventByStatusQuery } from "@/api/event/eventApiSlice";
import SpinnerText from "@/components/SpinnerWithText";

const MonitorEvents = () => {
  const status = "ongoing";

  const [eventList, setEventList] = useState<EventShortType[]>([]);
  const {
    data: eventListData,
    isLoading: isEventListLoading,
    // refetch: refetchEventList,
  } = useGetEventByStatusQuery(status);

  useEffect(() => {
    if (eventListData?.eventList && eventListData?.eventList.length > 0) {
      setEventList(eventListData?.eventList);
    }
  }, [eventListData]);

  const navigate = useNavigate();

  const handleEventClick = (eventId: string) => {
    navigate(`/monitor/events/view-event/${eventId}`);
  };

if (isEventListLoading) {
    return (
      <div>
        <SpinnerText
          spin={isEventListLoading}
        />
      </div>
    );
  }

  return (
    <div>
      <div>
        <ScrollArea className="w-full h-[calc(100vh-230px)] md:h-[calc(100vh-150px)]">
          <div className="flex flex-col gap-4">
            {eventList && eventList.length > 0 ? (
              eventList.map((event: EventShortType) => (
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

                    <Button onClick={() => handleEventClick(event._id)}>
                      View
                    </Button>
                  </Card>
                </div>
              ))
            ) : (
              <div>Currently no ongoing events</div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default MonitorEvents;
