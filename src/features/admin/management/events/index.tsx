import { useNavigate } from "react-router-dom";
import { setEvent } from "@/api/event/eventSlice";
import { useDispatch } from "react-redux";
import { Event } from "@/types/EventType";
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
import { useState } from "react";
import { useEventListData } from "@/hooks/dataHooks";
import { formatDateTime } from "@/utils/formatTime";

const Events = (): JSX.Element => {
  const eventList = useEventListData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEventClick = (event: Event) => {
    navigate("/admin/management/view-event");
    dispatch(setEvent(event));
  };

  const handleBoothClick = (event: Event) => {
    navigate("/admin/management/view-event/booth");
    dispatch(setEvent(event));
  };

  const handleViolationClick = (event: Event) => {
    navigate("/admin/management/violation");
    dispatch(setEvent(event));
  };

  const filteredEventList = eventList.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedStatus !== "all" ? event.status === selectedStatus : true),
  );

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
        <Button onClick={() => navigate("/admin/management/add-event")}>
          Add Event
        </Button>
      </div>
      <ScrollArea className="w-full h-[calc(100vh-230px)] md:h-[calc(100vh-150px)]">
        <div className="grid grid-cols-1 gap-4 pb-32">
          {!filteredEventList || filteredEventList.length === 0 ? (
            <div>Currently no events</div>
          ) : (
            filteredEventList.map((event: Event) => (
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
                    <Button onClick={() => handleEventClick(event)}>
                      View
                    </Button>
                    <Button onClick={() => handleBoothClick(event)}>
                      Booths
                    </Button>

                    <Button onClick={() => handleViolationClick(event)}>
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
