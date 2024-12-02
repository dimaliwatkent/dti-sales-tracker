import { useUserListData } from "@/hooks/dataHooks";
import { useState } from "react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserCard from "./UserCard";

const User = () => {
  const userList = useUserListData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const filteredUserList = userList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      user.role !== "rejected" &&
      (selectedRole !== "all" ? user.role === selectedRole : true),
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
          value={selectedRole}
          onValueChange={(value) => setSelectedRole(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">Approved User</SelectItem>
              <SelectItem value="newUser">Pending User</SelectItem>
              <SelectItem value="monitor">Monitor</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="w-full h-[calc(100vh-230px)] md:h-[calc(100vh-150px)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {!filteredUserList || filteredUserList.length === 0 ? (
            <div>Currently no user</div>
          ) : (
            filteredUserList.map((user) => (
              <div key={user._id}>
                <UserCard user={user} />
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default User;
