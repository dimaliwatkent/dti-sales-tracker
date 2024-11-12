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
import { Business } from "@/types/BusinessType";

import { useToast } from "@/components/ui/use-toast";
import { useUpdateStatusMutation } from "@/api/business/businessApiSlice";
import useDataLoader from "@/hooks/useDataLoader";
import { setEvent } from "@/api/event/eventSlice";
import { useDispatch } from "react-redux";
import SpinnerText from "@/components/SpinnerWithText";

interface ApproveBusinessProps {
  business: Business;
}

const ApproveBusiness = ({ business }: ApproveBusinessProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [updateStatus, { isLoading }] = useUpdateStatusMutation();
  const { isLoading: isLoadingRefetch, refetchEventList } = useDataLoader();

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

      refetchEventList();
      dispatch(setEvent(result.event));
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

  if (isLoading || isLoadingRefetch) {
    return (
      <div>
        <SpinnerText spin={isLoading || isLoadingRefetch} />
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
            <DialogTitle>
              Are you sure you want to approve {business.name} application
            </DialogTitle>
          </DialogHeader>

          <DialogDescription>This can't be Undone</DialogDescription>
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
