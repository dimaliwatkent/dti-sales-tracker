import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OpenEventTab from "./OpenEventTab";
import UserEventTab from "./UserEventTab";

import useInterval from "@/hooks/useInterval";
import useDataLoader from "@/hooks/useDataLoader";
import { intervalTime } from "@/constants";
import Refresh from "@/components/Refresh";

const Events = () => {
  const { refetchUserEventList } = useDataLoader();

  useInterval(() => {
    refetchUserEventList();
  }, intervalTime.userEvent);

  return (
    <div>
      <div>
        <Tabs defaultValue="openEventList" className="">
          <TabsList>
            <TabsTrigger value="openEventList">Application</TabsTrigger>
            <TabsTrigger value="userEventList">Applied</TabsTrigger>
          </TabsList>
          <Refresh refetch={refetchUserEventList} className="ml-2" />
          <TabsContent value="openEventList">
            <OpenEventTab />
          </TabsContent>
          <TabsContent value="userEventList">
            <UserEventTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;
