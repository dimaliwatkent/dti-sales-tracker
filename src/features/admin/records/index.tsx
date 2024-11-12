import { useRecordListData } from "@/hooks/dataHooks";
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
import { Record } from "@/types/RecordType";
import useDataLoader from "@/hooks/useDataLoader";
import useInterval from "@/hooks/useInterval";
import { intervalTime } from "@/constants";
import Refresh from "@/components/Refresh";

const AdminRecords = () => {
  const recordList = useRecordListData();
  const { isLoading, refetchRecordList } = useDataLoader();

  const [activeEvent, setActiveEvent] = useState<Record | undefined>(undefined);

  useEffect(() => {
    if (recordList && recordList.length > 0) {
      setActiveEvent(recordList[0]);
    }
  }, [recordList]);

  useInterval(() => {
    refetchRecordList();
    console.log("interval refetch");
  }, intervalTime.adminRecords);

  const handleSelectChange = (value: string) => {
    const selectedEvent = recordList.find((record) => record.eventId === value);
    setActiveEvent(selectedEvent);
  };

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
          <div className="mb-8 flex gap-2">
            <Select
              value={activeEvent?.eventId}
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
            <Refresh refetch={refetchRecordList} />
          </div>
          <div>
            <SaleTable activeEvent={activeEvent} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRecords;
