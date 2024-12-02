import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BoothType, BusinessBoothType } from "@/types/BoothType";

interface BoothAddBusinessProps {
  selectedBooth: string;
  booths: BoothType[];
  setBooths: (booths: BoothType[]) => void;
  businessList: BusinessBoothType[];
}

const BoothAddBusiness = ({
  selectedBooth,
  booths,
  setBooths,
  businessList,
}: BoothAddBusinessProps) => {
  const [open, setOpen] = useState(false);

  const handleBusinessSelect = (business: BusinessBoothType) => {
    const updatedBooths = booths.map((booth) => {
      if (booth.code === selectedBooth) {
        return { ...booth, business: business._id };
      }
      return booth;
    });
    setBooths(updatedBooths);
    setOpen(false);
  };

  const assignedBusinessIds = booths.map((booth) => booth.business);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>Assign</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select a Business</DialogTitle>
            <DialogDescription>
              This will add the booth number to the selected business
            </DialogDescription>
          </DialogHeader>
          <ul>
            {businessList
              .filter((business) => !assignedBusinessIds.includes(business._id))
              .map((business) => (
                <div
                  key={business._id}
                  onClick={() => handleBusinessSelect(business)}
                  className="flex justify-between cursor-pointer border p-3 rounded-lg bg-secondary hover:border-primary "
                >
                  <div className="flex gap-3 items-center">
                    <Plus size={16} />
                    <p>{business.name}</p>
                  </div>
                </div>
              ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoothAddBusiness;
