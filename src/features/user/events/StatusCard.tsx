import ProcessCard from "./ProcessCard";
import { BusinessType } from "@/types/BusinessType";
import { useNavigate } from "react-router-dom";

import { applicationStatusMap } from "@/constants";

import { Button } from "@/components/ui/button";

interface StatusCardProps {
  business: BusinessType | undefined;
  eventId: string;
}
const StatusCard = ({ business, eventId }: StatusCardProps) => {
  const status = business?.applicationStatus;
  const message = business?.statusMessage;

  const navigate = useNavigate();

  const handleEventClick = () => {
    navigate(`/events/view-event/${eventId}`);
  };

  const handleApply = () => {
    navigate(`/events/application/${eventId}`);
  };

  const handleComply = () => {
    navigate(`/events/edit-application/${eventId}`);
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
      <div>
        <Button onClick={() => handleEventClick()}>
          Download Requirements
        </Button>
      </div>
    </div>
  );
};

export default StatusCard;
