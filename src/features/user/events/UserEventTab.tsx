import { EventPopulatedType } from "@/types/EventType";
import { formatDateTime } from "@/utils/formatTime";
import { eventStatusMap } from "@/constants";

import BusinessCard from "@/features/admin/management/business/BusinessCard";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserEventTabProps {
  userEventList: EventPopulatedType[];
}

const UserEventTab = ({ userEventList }: UserEventTabProps) => {
  return (
    <div>
      <ScrollArea className="w-full h-[calc(100vh-180px)] md:h-[calc(100vh-180px)]">
        <div className="flex justify-center my-4">
          <p className="font-bold">Events User Has Applied To</p>
        </div>
        <div className="grid grid-cols-1 gap-4 pb-32">
          {!userEventList || userEventList.length === 0 ? (
            <div>Currently no events applied</div>
          ) : (
            userEventList.map((event: EventPopulatedType) => (
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
                  <div className="flex gap-2">
                    <p className="font-bold">Location Type</p>
                    {event?.isLocal ? "Local" : "Non-Local"}
                  </div>
                  {event.business && (
                    <BusinessCard business={event.business} type="regular" />
                  )}
                </Card>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserEventTab;
