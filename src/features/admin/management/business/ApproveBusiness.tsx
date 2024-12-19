import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BusinessType } from "@/types/BusinessType";

import { useToast } from "@/components/ui/use-toast";
import { useUpdateStatusMutation } from "@/api/business/businessApiSlice";
import SpinnerText from "@/components/SpinnerWithText";

interface ApproveBusinessProps {
  business: BusinessType;
}

const ApproveBusiness = ({ business }: ApproveBusinessProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [updateStatus, { isLoading }] = useUpdateStatusMutation();

  const handleSubmit = async () => {
    try {
      const result = await updateStatus({
        id: business._id,
        status: "approved",
        message: null,
      }).unwrap();

      toast({
        variant: "default",
        title: "Success",
        description: result.message,
      });

      setOpen(false);
    } catch (error: unknown) {
      if (error) {
        toast({
          variant: "destructive",
          title: (error as { data: { message: string } }).data.message,
          description: (error as { data: { err: string } }).data.err,
        });
      }
    }
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="my-2">Approve</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>

          <DialogDescription>
            This will approve <span className="font-bold">{business.name}</span>{" "}
            application
          </DialogDescription>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                setOpen(false);
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApproveBusiness;
