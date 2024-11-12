import { selectEvent } from "@/api/event/eventSlice";
import { useSelector } from "react-redux";
import { formatDateTime } from "@/utils/formatTime";
import { eventStatusMap } from "@/constants";

import BusinessCard from "@/features/admin/management/business/BusinessCard";

const ViewEvent = (): JSX.Element => {
  const event = useSelector(selectEvent);

  return (
    <div>
      <p className="text-3xl font-bold my-6">{event.title}</p>
      <div className="mb-4 space-y-3 rounded-lg border p-4">
        <div className="flex gap-2">
          <p className="font-bold">Duration</p>
          {formatDateTime(event.startDate)} - {formatDateTime(event.endDate)}
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
      </div>

      <div>
        <div>
          <p className="text-xl font-bold mb-2">Exhibitors</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {!event.businessList || event.businessList.length === 0 ? (
              <p>No approved exhibitors</p>
            ) : (
              event.businessList
                .filter((business) => business.applicationStatus === "approved")
                .map((business) => (
                  <div key={business._id}>
                    <BusinessCard business={business} type={"regular"} />
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
      <p>{event.isArchived ? "This event is Archived" : ""}</p>
    </div>
  );
};

export default ViewEvent;
