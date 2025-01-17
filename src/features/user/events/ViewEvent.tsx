import { formatDateTime } from "@/utils/formatTime";
import { eventStatusMap } from "@/constants";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { EventType } from "@/types/EventType";
import { useGetEventQuery } from "@/api/event/eventApiSlice";
import SpinnerText from "@/components/SpinnerWithText";

const ViewEvent = (): JSX.Element => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventType>();

  const { data: eventData, isLoading: isEventLoading } = useGetEventQuery(id);

  useEffect(() => {
    if (eventData) {
      setEvent(eventData?.event);
    }
  }, [eventData]);

  if (isEventLoading) {
    return (
      <div>
        <SpinnerText spin={isEventLoading} />
      </div>
    );
  }

  return (
    <div>
      <p className="text-3xl font-bold my-6">{event?.title}</p>
      <div className="mb-4 space-y-3 rounded-lg border p-4">
        <div className="flex gap-2">
          <p className="font-bold">Duration</p>
          {formatDateTime(event?.startDate)} - {formatDateTime(event?.endDate)}
        </div>

        <div className="flex gap-2">
          <p className="font-bold">Application Duration</p>
          {formatDateTime(event?.applicationStart)} -{" "}
          {formatDateTime(event?.applicationEnd)}
        </div>
        <div className="flex gap-2">
          <p className="font-bold">Status</p>
          {eventStatusMap[event?.status || ""]}
        </div>
        <div className="flex gap-2">
          <p className="font-bold">Location</p>
          {event?.location}
        </div>
      </div>
      <div className="mb-4">
        <p className="text-xl font-bold mb-2" id="requirements">
          Requirements
        </p>

        <div className="space-y-3">
          {event?.documentList && event?.documentList.length > 0 ? (
            event?.documentList.map((doc, index) => (
              <div key={index}>
                {doc && (
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-primary/70">{doc.filename}</p>
                    <div className="flex gap-2">
                      <div className="text-left bg-primary h-8 px-4 flex items-center justify-center rounded-lg hover:scale-105">
                        <a
                          href={doc.url}
                          download={doc.filename}
                          rel="noopener noreferrer"
                        >
                          <p className="text-background">Download File</p>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>No added requirements.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEvent;
