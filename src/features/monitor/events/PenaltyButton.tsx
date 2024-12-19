import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUserData } from "@/hooks/dataHooks";
import { useAddViolationMutation } from "@/api/violation/violationApiSlice";
import { useToast } from "@/components/ui/use-toast";
import { ViolationType } from "@/types/ViolationType";
import { Textarea } from "@/components/ui/textarea";

interface PenaltyButtonProps {
  businessId: string;
  violation: ViolationType;
  refetchBusiness: () => void;
  type: string;
}

const PenaltyButton = ({
  businessId,
  violation,
  refetchBusiness,
  type,
}: PenaltyButtonProps) => {
  const [open, setOpen] = useState(false);
  const [loadingButton, setLoadingButton] = useState("");
  const monitor = useUserData();
  const [violationMessage, setViolationMessage] = useState("");

  const [addViolation] = useAddViolationMutation();
  const { toast } = useToast();

  const handleAddViolation = async () => {
    setLoadingButton(violation.name);
    try {
      const result = await addViolation({
        businessId: businessId,
        violation: {
          ...violation,
          message: violationMessage,
          monitor: monitor._id,
        },
      }).unwrap();

      toast({
        variant: "default",
        title: "Success",
        description: result.message,
      });

      refetchBusiness();
      setLoadingButton("");
      setOpen(false);
      setViolationMessage("");
    } catch (error: unknown) {
      if (error) {
        toast({
          variant: "destructive",
          title: (error as { data: { message: string } }).data.message,
          description: (error as { data: { err: string } }).data.err,
        });
      }
      setLoadingButton("");
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => setOpen(true)}
            disabled={loadingButton === violation.name}
          >
            {loadingButton === violation.name ? "Loading..." : type}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{type}</DialogTitle>
            <DialogDescription>
              This will give a <span className="font-bold">{type}</span> to the
              selected business
            </DialogDescription>
          </DialogHeader>
          {type === "Penalty" && (
            <div>
              <Textarea
                className="h-20"
                value={violationMessage}
                onChange={(e) => setViolationMessage(e.target.value)}
                placeholder="Write here your reason"
              />
            </div>
          )}
          <div>
            <Button
              onClick={handleAddViolation}
              disabled={loadingButton === violation.name || !violationMessage}
            >
              {loadingButton === violation.name ? "Loading..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PenaltyButton;
