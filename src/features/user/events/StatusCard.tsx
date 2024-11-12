import ProcessCard from "./ProcessCard";
import { setEvent } from "@/api/event/eventSlice";
import { Business } from "@/types/BusinessType";
import { Event } from "@/types/EventType";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { applicationStatusMap } from "@/constants";

import { Button } from "@/components/ui/button";
import { setActiveBusiness } from "@/api/business/businessSlice";

interface StatusCardProps {
  business: Business | undefined;
  event: Event;
}
const StatusCard = ({ business, event }: StatusCardProps) => {
  const status = business?.applicationStatus;
  const message = business?.statusMessage;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEventClick = () => {
    navigate("/events/view-event");
    dispatch(setEvent(event));
  };

  const handleApply = () => {
    navigate("/events/application");
    dispatch(setEvent(event));
  };

  const handleComply = () => {
    navigate("/events/edit-application");
    dispatch(setEvent(event));
    dispatch(setActiveBusiness(business));
  };

  if (!business) {
    return (
      <div className="flex gap-2 mt-3">
        <Button onClick={() => handleEventClick()}>View Event</Button>
        <Button onClick={() => handleApply()}>Apply</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="border rounded-lg p-4">
        <p className="text-destructive py-4">{message}</p>
        <div className="flex gap-2 mb-3">
          <p className="text-sm">{business.name}</p>
          <p className="text-xs bg-secondary px-2 rounded-full">
            {applicationStatusMap[business.applicationStatus]}
          </p>
        </div>
        <ProcessCard currentStep={status === "approved" ? 2 : 1} />
      </div>
      {status === "forcompletion" ? (
        <div className="flex gap-2 mt-3">
          <Button onClick={() => handleEventClick()}>View Event</Button>
          <Button onClick={handleComply}>Comply</Button>
        </div>
      ) : (
        <div className="flex gap-2 mt-3">
          <Button onClick={() => handleEventClick()}>View Event</Button>
          <Button disabled>Applied</Button>
        </div>
      )}
    </div>
  );
};

export default StatusCard;
