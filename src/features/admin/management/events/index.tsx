import { useNavigate } from "react-router-dom";
import { EventType } from "@/types/EventType";
import { eventStatusMap } from "@/constants";

import { ScrollArea } from "@/components/ui/scroll-area";
import OptionButton from "./OptionButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/utils/formatTime";
import { useGetEventListQuery } from "@/api/event/eventApiSlice";
import SpinnerText from "@/components/SpinnerWithText";
import Refresh from "@/components/Refresh";

const Events = (): JSX.Element => {
  const [eventList, setEventList] = useState<EventType[]>([]);
  const {
    data: eventListData,
    isLoading: isEventListLoading,
    refetch: refetchEventList,
  } = useGetEventListQuery({});

  useEffect(() => {
    if (eventListData?.eventList) {
      setEventList(eventListData?.eventList);
    }
  }, [eventListData]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const navigate = useNavigate();

  const handleEventClick = (id: string) => {
    navigate(`/admin/management/view-event/${id}`);
  };

  const handleBoothClick = (id: string) => {
    navigate(`/admin/management/view-event/booth/${id}`);
  };

  const handleViolationClick = (id: string) => {
    navigate(`/admin/management/violation/${id}`);
  };

  const handleEventViolationClick = (id: string) => {
    navigate(`/admin/management/violation/event-violation/${id}`);
  };

  const handleAddEvent = () => {
    navigate("/admin/management/add-event");
  };

  const filteredEventList = eventList.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedStatus !== "all" ? event.status === selectedStatus : true),
  );

  useEffect(() => {
    refetchEventList();
  }, []);

  if (isEventListLoading) {
    return (
      <div>
        <SpinnerText spin={isEventListLoading} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex py-4 gap-2">
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search events..."
        />

        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="applicationOpen">
                Open for Application
              </SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Refresh refetch={refetchEventList} />
        <Button onClick={handleAddEvent}>Add Event</Button>
      </div>
      <ScrollArea className="w-full h-[calc(100vh-230px)] md:h-[calc(100vh-150px)]">
        <div className="grid grid-cols-1 gap-4 pb-32">
          {!filteredEventList || filteredEventList.length === 0 ? (
            <div>Currently no events</div>
          ) : (
            filteredEventList.map((event: EventType) => (
              <div key={event._id}>
                <Card className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-bold">{event.title}</p>

                    <OptionButton event={event} />
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
                  <div className="flex gap-2">
                    <Button onClick={() => handleEventClick(event._id)}>
                      View
                    </Button>
                    <Button onClick={() => handleBoothClick(event._id)}>
                      Booths
                    </Button>

                    <Button onClick={() => handleViolationClick(event._id)}>
                      Violators
                    </Button>

                    <Button
                      onClick={() => handleEventViolationClick(event._id)}
                    >
                      Violations
                    </Button>
                  </div>
                </Card>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Events;
