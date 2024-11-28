import Events from "./events";
import Business from "./business";
import User from "./user";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import useInterval from "@/hooks/useInterval";
import useDataLoader from "@/hooks/useDataLoader";
import SpinnerText from "@/components/SpinnerWithText";
import { intervalTime } from "@/constants";
import Refresh from "@/components/Refresh";

const AdminManagement = () => {
  const { isLoading, refetchAll } = useDataLoader();

  useInterval(() => {
    refetchAll();
    console.log("interval refetch");
  }, intervalTime.adminManagement);

  if (isLoading) {
    return (
      <div>
        <SpinnerText spin={isLoading} />
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue="events" className="">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <Refresh refetch={refetchAll} className="ml-2" />
        <TabsContent value="events">
          <Events />
        </TabsContent>
        <TabsContent value="businesses">
          <Business />
        </TabsContent>
        <TabsContent value="users">
          <User />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminManagement;
