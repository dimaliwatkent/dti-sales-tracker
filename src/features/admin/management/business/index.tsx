import { useBusinessListData } from "@/hooks/dataHooks";
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
import BusinessCard from "./BusinessCard";
import { ScrollArea } from "@/components/ui/scroll-area";

const Business = () => {
  const businessList = useBusinessListData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredBusinessList = businessList.filter(
    (business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedStatus !== "all"
        ? business.applicationStatus === selectedStatus
        : true),
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
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="w-full h-[calc(100vh-230px)] md:h-[calc(100vh-150px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {!filteredBusinessList || filteredBusinessList.length === 0 ? (
            <div>Currently no events</div>
          ) : (
            filteredBusinessList.map((business) => (
              <div key={business._id}>
                <BusinessCard business={business} type={"regular"} />
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Business;
