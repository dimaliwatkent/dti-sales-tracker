import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { useState } from "react";
import { useBusinessListData } from "@/hooks/dataHooks";

interface SelectBusinessProps {
  businessIdList: string[];
  setBusinessIdList: (businessIdList: string[]) => void;
}

const SelectBusiness: React.FC<SelectBusinessProps> = ({
  businessIdList,
  setBusinessIdList,
}) => {
  const [selectedBusinessIds, setSelectedBusinessIds] = useState<string[]>(
    businessIdList || [],
  );

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const businessList = useBusinessListData();

  const handleSelectBusiness = (businessId: string) => {
    if (selectedBusinessIds.includes(businessId)) {
      setSelectedBusinessIds(
        selectedBusinessIds.filter((id) => id !== businessId),
      );
    } else {
      setSelectedBusinessIds([...selectedBusinessIds, businessId]);
    }
  };

  const handleConfirm = () => {
    setBusinessIdList(selectedBusinessIds);
    setOpen(false);
  };

  const filteredBusinessList = businessList.filter(
    (business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      business.applicationStatus === "approved",
  );

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button type="button">Add Business</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Businesses to Add</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search businesses..."
            />
          </div>
          <div>
            {filteredBusinessList.map((business) => (
              <div key={business._id}>
                <div
                  className="flex items-center gap-2 py-2"
                  onClick={() => handleSelectBusiness(business._id)}
                >
                  <Checkbox
                    checked={selectedBusinessIds.includes(business._id)}
                  />
                  <p style={{ marginLeft: 8 }}>{business.name}</p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SelectBusiness;
