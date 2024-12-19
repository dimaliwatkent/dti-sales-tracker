import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OpenEventTab from "./OpenEventTab";
import UserEventTab from "./UserEventTab";

import Refresh from "@/components/Refresh";
import OngoingEventTab from "./OngoingEventTab";
import { useEffect, useState } from "react";
import { useGetUserEventListQuery } from "@/api/event/eventApiSlice";
import { useUserData } from "@/hooks/dataHooks";
import { EventPopulatedType, EventType } from "@/types/EventType";
import SpinnerText from "@/components/SpinnerWithText";

const Events = () => {
  const user = useUserData();

  const [userEventList, setUserEventList] = useState<EventPopulatedType[]>([]);
  const [openEventList, setOpenEventList] = useState<EventType[]>([]);
  const {
    data: eventListData,
    isLoading: isEventListLoading,
    refetch: refetchEventList,
  } = useGetUserEventListQuery(user._id);

  useEffect(() => {
    if (eventListData) {
      setUserEventList(eventListData?.userEventList);
      setOpenEventList(eventListData?.openEventList);
    }
  }, [eventListData]);

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
      <div>
        <Tabs defaultValue="ongoingEventList" className="">
          <div className="flex gap-2">
            <TabsList>
              <TabsTrigger value="ongoingEventList">Ongoing</TabsTrigger>
              <TabsTrigger value="openEventList">Application</TabsTrigger>
              <TabsTrigger value="userEventList">Applied</TabsTrigger>
            </TabsList>
            <Refresh refetch={refetchEventList} className="ml-2" />
          </div>
          <TabsContent value="ongoingEventList">
            <OngoingEventTab userEventList={userEventList} />
          </TabsContent>
          <TabsContent value="openEventList">
            <OpenEventTab
              userEventList={userEventList}
              openEventList={openEventList}
            />
          </TabsContent>
          <TabsContent value="userEventList">
            <UserEventTab userEventList={userEventList} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
