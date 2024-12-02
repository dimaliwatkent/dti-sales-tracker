import { EventBusiness } from "@/types/EventType";
import { formatDateTime } from "@/utils/formatTime";
import { eventStatusMap } from "@/constants";

import { Card } from "@/components/ui/card";
import { useUserEventListData } from "@/hooks/dataHooks";
import useDataLoader from "@/hooks/useDataLoader";
import SpinnerText from "@/components/SpinnerWithText";

const UserEventTab = () => {
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
      <div className="flex justify-center my-4">
        <p className="font-bold">Events User Has Applied To</p>
      </div>
      <div className="grid grid-cols-1 gap-4 pb-32">
        {!userEventList || userEventList.length === 0 ? (
          <div>Currently no events applied</div>
        ) : (
          userEventList.map((event: EventBusiness) => (
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
                <div className="border rounded-lg p-3">
                  <div className="flex justify-center">
                    <p className="font-bold">Business</p>
                  </div>
                  <div className="flex gap-2">
                    <p className="font-bold">Business Name</p>
                    {event.business.name}
                  </div>

                  <div className="flex gap-2">
                    <p className="font-bold">Application Status</p>
                    {event.business.applicationStatus}
                  </div>

                </div>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserEventTab;
