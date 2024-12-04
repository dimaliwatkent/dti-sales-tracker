import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { useUserListData } from "@/hooks/dataHooks";
import { useChangeRoleMutation } from "@/api/user/userApiSlice";
import { intervalTime } from "@/constants";
import useDataLoader from "@/hooks/useDataLoader";
import { useToast } from "@/components/ui/use-toast";

import useInterval from "@/hooks/useInterval";
import SpinnerText from "@/components/SpinnerWithText";
import Refresh from "@/components/Refresh";

const AdminRegistrations = () => {
  const userList = useUserListData();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { isLoading: isDataLoading, refetchUserList } = useDataLoader();

  const [changeRole, { isLoading }] = useChangeRoleMutation();
  const [selectedRole, setSelectedRole] = useState("newUser");

  const filteredUserList = () => {
    return userList.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedRole !== "all" ? user.role === selectedRole : true),
    );
  };

  useInterval(() => {
    refetchUserList();
    console.log("interval refetch");
  }, intervalTime.adminRegistration);

  if (isLoading || isDataLoading) {
    return (
      <div>
        <SpinnerText spin={isLoading || isDataLoading} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex py-4 gap-2">
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search user..."
        />
        <Select
          value={selectedRole}
          onValueChange={(value) => setSelectedRole(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filters" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="newUser">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Refresh refetch={refetchUserList} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Business Name</TableHead>
            <TableHead>Document</TableHead>
            {selectedRole === "newUser" && (
              <div>
                <TableHead>Accept/Reject</TableHead>
              </div>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUserList().length > 0 ? (
            filteredUserList().map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <div className="bg-gray-800 w-10 h-10 rounded-lg"></div>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>0{user.phoneNumber}</TableCell>
                <TableCell>{user.businessName}</TableCell>
                <TableCell>
                  {
                    <div className="text-left bg-primary h-8 w-32 flex items-center justify-center rounded-lg">
                      <a
                        href={user.document}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <p className="text-background">View File</p>
                      </a>
                    </div>
                  }
                </TableCell>
                {selectedRole === "newUser" && (
                  <TableCell>
                    <div>
                      <Select
                        value={user.role}
                        onValueChange={async (value) => {
                          const result = await changeRole({
                            id: user._id,
                            role: value,
                          }).unwrap();

                          toast({
                            variant: "default",
                            title: "Success",
                            description: result.message,
                          });
                          refetchUserList();
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Change Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Accept or Reject</SelectLabel>
                            <SelectItem value="newUser">Pending</SelectItem>
                            <SelectItem value="user">Accept as User</SelectItem>
                            <SelectItem value="monitor">
                              Accept as Monitor
                            </SelectItem>
                            <SelectItem value="admin">
                              Accept as Admin
                            </SelectItem>
                            <SelectItem value="rejected">Reject</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                )}
                <TableCell></TableCell>
              </TableRow>
            ))
          ) : (
            <div className="m-2">
              <p>No user registration</p>
            </div>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminRegistrations;
