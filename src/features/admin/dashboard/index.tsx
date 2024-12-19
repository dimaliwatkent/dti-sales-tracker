import { Calendar as CalendarIcon } from "lucide-react";
import DashboardCard from "./DashboardCard";

import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

import { formatDateTime } from "@/utils/formatTime";
import { formatCurrency } from "@/utils/formatCurrency";
import BusinessTable from "./BusinessTable";
import SpinnerText from "@/components/SpinnerWithText";
import Refresh from "@/components/Refresh";
import {
  useGetEventByStatusQuery,
  useGetEventWithBusinessQuery,
} from "@/api/event/eventApiSlice";
import { EventWithBusinessType } from "@/types/EventType";
import { getBusinessData } from "./utils";

const AdminDashboard = () => {
  const status = "ongoing";
  const [eventList, setEventList] = useState<EventWithBusinessType[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<
    EventWithBusinessType | undefined
  >(undefined);

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
    data: eventWithBusinessData,
    isLoading: isEventWithBusinessLoading,
    refetch: refetchEventWithBusiness,
  } = useGetEventWithBusinessQuery(selectedEventId, {
    skip: selectedEventId === "",
  });

  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleSelectChange = (value: string) => {
    setSelectedEventId(value);
  };

  useEffect(() => {
    if (eventWithBusinessData?.event) {
      setSelectedEvent(eventWithBusinessData?.event);
    }
  }, [eventWithBusinessData, selectedEventId]);

  useEffect(() => {
    if (selectedEventId !== "" && refetchEventWithBusiness) {
      refetchEventWithBusiness();
    }
  }, [selectedEventId, refetchEventWithBusiness]);

  if (isEventListLoading || isEventWithBusinessLoading) {
    return (
      <div>
        <SpinnerText spin={isEventWithBusinessLoading} />
      </div>
    );
  }

  return (
    <div>
      {!eventList || eventList.length === 0 ? (
        <div>No ongoing event</div>
      ) : (
        <div>
          <div className="header md:flex justify-between py-8">
            <div className="pb-8 md:pb-0">
              <p className="text-2xl font-bold">{selectedEvent?.title}</p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full flex items-center gap-2 border rounded-md py-1 px-3 shadow-sm">
                <CalendarIcon size={16} strokeWidth={1.5} />
                <p>
                  <span className="">
                    {formatDateTime(selectedEvent?.startDate)}
                  </span>{" "}
                  -{" "}
                  <span className="">
                    {" "}
                    {formatDateTime(selectedEvent?.endDate)}{" "}
                  </span>
                </p>
              </div>

              <div className=" w-full md:w-48">
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
              </div>
              <div>
                <Refresh refetch={refetchEventList} />
              </div>
            </div>
          </div>
          <div className="content pb-32">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="cards flex flex-col md:flex-row gap-4 ">
                  <div className="business-chart flex-1">
                    <DashboardCard
                      data={getBusinessData(selectedEvent)}
                      title={"Businesses"}
                    />
                  </div>
                  <div className="totalSale-chart flex-1 ">
                    <Card className="p-6 h-40">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-bold pb-2 text-lg">
                            Total Event Sales
                          </p>
                          <div className="text-sm text-primary/70 font-bold ">
                            <p className="text-3xl font bold">
                              {formatCurrency(
                                selectedEvent?.totalEventSales.$numberDecimal ||
                                  0,
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold mb-6 mt-10">
                    {formatDateTime(date)}
                  </p>
                </div>

                <div className="border p-6 rounded-xl">
                  <BusinessTable selectedEvent={selectedEvent} />
                </div>
              </div>
              <div className="hidden md:block">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
