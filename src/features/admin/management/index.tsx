import Events from "./events";
import User from "./user";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminManagement = () => {
  return (
    <div>
      <Tabs defaultValue="events" className="">
        <div className="flex">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="events">
          <Events />
        </TabsContent>
        <TabsContent value="users">
          <User />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminManagement;
