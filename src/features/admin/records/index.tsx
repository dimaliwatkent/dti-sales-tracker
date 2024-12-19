import SaleTable from "./SaleTable";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import SpinnerText from "@/components/SpinnerWithText";
import Refresh from "@/components/Refresh";
import { useGetEventByStatusQuery } from "@/api/event/eventApiSlice";

import { EventShortType } from "@/types/EventType";
import { useGetEventSaleQuery } from "@/api/sale/saleApiSlice";
import { EventSaleType } from "@/types/SaleType";

const AdminRecords = () => {
  const status = "ongoing";

  const [eventList, setEventList] = useState<EventShortType[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<EventSaleType | undefined>(
    undefined,
  );

  const {
    data: eventListData,
    isLoading: isEventListLoading,
    refetch: refetchEventList,
  } = useGetEventByStatusQuery(status);

  useEffect(() => {
    if (eventListData?.eventList && eventListData?.eventList.length > 0) {
      setEventList(eventListData?.eventList);
      setSelectedEventId(eventListData?.eventList[0]._id);
    }
  }, [eventListData]);

  const {
    data: eventWithSaleData,
    isLoading: isEventWithSaleLoading,
    refetch: refetchEventWithSale,
  } = useGetEventSaleQuery(selectedEventId, {
    skip: selectedEventId === "",
  });

  const handleSelectChange = (value: string) => {
    setSelectedEventId(value);
  };

  useEffect(() => {
    if (eventWithSaleData?.event) {
      setSelectedEvent(eventWithSaleData?.event);
    }
  }, [eventWithSaleData, selectedEventId]);

  useEffect(() => {
    if (selectedEventId !== "" && refetchEventWithSale) {
      refetchEventWithSale();
    }
  }, [selectedEventId, refetchEventWithSale]);

  if (isEventListLoading || isEventWithSaleLoading) {
    return (
      <div>
        <SpinnerText spin={isEventWithSaleLoading} />
      </div>
    );
  }

  return (
    <div>
      {!eventList || eventList.length === 0 ? (
        <div>No ongoing event</div>
      ) : (
        <div>
          <div className="mb-8 flex gap-2">
            <Select
              value={selectedEvent?._id}
              onValueChange={(value) => handleSelectChange(value)}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select Event" />
              </SelectTrigger>
              <SelectContent>
                {eventList.map((event) => (
                  <SelectItem key={event._id} value={event._id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Refresh refetch={refetchEventList} />
          </div>
          <div>
            <SaleTable selectedEvent={selectedEvent} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRecords;
