import { useMonitorEventListData } from "@/hooks/dataHooks";
import { formatDateTime } from "@/utils/formatTime";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { EventBusinessMonitor } from "@/types/EventType";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMonitorEvent } from "@/api/event/eventSlice";

const MonitorEvents = () => {
  const eventList = useMonitorEventListData();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEventClick = (event: EventBusinessMonitor) => {
    navigate("/monitor/events/view-event");
    dispatch(setMonitorEvent(event));
  };

  return (
    <div>
      <div>
        <ScrollArea className="w-full h-[calc(100vh-230px)] md:h-[calc(100vh-150px)]">
          <div>
            {eventList && eventList.length > 0 ? (
              eventList.map((event: EventBusinessMonitor) => (
                <div key={event._id}>
                  <Card
                    className="p-6 space-y-3"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-bold">{event.title}</p>
                    </div>

                    <div className="flex gap-2">
                      <p className="font-bold">Duration</p>
                      {formatDateTime(event.startDate)} -{" "}
                      {formatDateTime(event.endDate)}
                    </div>

                    <Button onClick={() => handleEventClick(event)}>
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
