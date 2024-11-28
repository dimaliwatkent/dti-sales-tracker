import { useRecordListData } from "@/hooks/dataHooks";
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
import { useUserListData } from "@/hooks/dataHooks";
import BusinessTable from "./BusinessTable";
import SpinnerText from "@/components/SpinnerWithText";
import Refresh from "@/components/Refresh";
import { Record } from "@/types/RecordType";
import useDataLoader from "@/hooks/useDataLoader";
import useInterval from "@/hooks/useInterval";
import { intervalTime } from "@/constants";

const AdminDashboard = () => {
  const recordList = useRecordListData();
  const userList = useUserListData();
  const { isLoading, refetchRecordList } = useDataLoader();

  const [activeEvent, setActiveEvent] = useState<Record | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(new Date());

  // business chart info
  const exhibitorCount = activeEvent?.exhibitorCount ?? 0;
  const applicantCount = activeEvent?.applicantCount ?? 0;
  const rejectedCount = activeEvent?.rejectedCount;

  // total sales
  const totalSales = activeEvent?.overallAmount;

  const businessData = [
    {
      name: "Participant",
      value: exhibitorCount,
      fill: "hsl(var(--chart-1))",
    },
    {
      name: "Not",
      value: applicantCount,
      fill: "hsl(var(--chart-2))",
    },
    {
      name: "Rejected",
      value: rejectedCount,
      fill: "hsl(var(--chart-3))",
    },
  ];

  // user chart info
  const userData = [
    {
      name: "User",
      value: userList?.filter((user) => user.role === "user")?.length ?? 0,
      fill: "hsl(var(--chart-1))",
    },
    {
      name: "New User",
      value: userList?.filter((user) => user.role === "newUser")?.length ?? 0,
      fill: "hsl(var(--chart-2))",
    },
    {
      name: "Monitor",
      value: userList?.filter((user) => user.role === "monitor")?.length ?? 0,
      fill: "hsl(var(--chart-3))",
    },
  ];

  const handleSelectChange = (value: string) => {
    const selectedEvent = recordList.find((record) => record.eventId === value);
    setActiveEvent(selectedEvent);
  };

  useEffect(() => {
    if (recordList && recordList.length > 0) {
      setActiveEvent(recordList[0]);
    }
  }, [recordList]);

  useInterval(() => {
    refetchRecordList();
    console.log("interval refetch");
  }, intervalTime.adminDashboard);

  if (isLoading) {
    return (
      <div>
        <SpinnerText spin={isLoading} />
      </div>
    );
  }

  return (
    <div>
      {!recordList || recordList.length === 0 ? (
        <div>No ongoing event</div>
      ) : (
        <div>
          <div className="header md:flex justify-between py-8">
            <div className="pb-8 md:pb-0">
              <p className="text-2xl font-bold">{activeEvent?.eventName}</p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full flex items-center gap-2 border rounded-md py-1 px-3 shadow-sm">
                <CalendarIcon size={16} strokeWidth={1.5} />
                <p>
                  <span className="">
                    {formatDateTime(activeEvent?.startDate)}
                  </span>{" "}
                  -{" "}
                  <span className="">
                    {" "}
                    {formatDateTime(activeEvent?.endDate)}{" "}
                  </span>
                </p>
              </div>

              <div className=" w-full md:w-48">
                <Select
                  value={activeEvent?.eventId}
                  defaultValue={recordList[0].eventId}
                  onValueChange={(value) => handleSelectChange(value)}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select Event" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordList.map((event) => (
                      <SelectItem key={event.eventId} value={event.eventId}>
                        {event.eventName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Refresh refetch={refetchRecordList} />
              </div>
            </div>
          </div>
          <div className="content pb-32">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="cards flex flex-col md:flex-row gap-4 ">
                  <div className="business-chart flex-1">
                    <DashboardCard data={businessData} title={"Businesses"} />
                  </div>
                  <div className="user-chart flex-1">
                    <DashboardCard data={userData} title={"Users"} />
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
                              {formatCurrency(totalSales || 0)}
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
                  <BusinessTable activeEvent={activeEvent} />
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
