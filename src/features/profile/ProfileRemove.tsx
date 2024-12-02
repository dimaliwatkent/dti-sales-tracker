import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDeleteProfileMutation } from "@/api/upload/uploadApiSlice";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/types/UserType";
import useDataLoader from "@/hooks/useDataLoader";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProfileUploadProps {
  user: User;
}

const ProfileRemove = ({ user }: ProfileUploadProps) => {
  const [open, setOpen] = useState(false);

  const { refetchUserData } = useDataLoader();

  const { toast } = useToast();
  const [deleteProfile, { isLoading }] = useDeleteProfileMutation();

  const handleRemove = async () => {
    try {
      if (user.picture) {
        const result = await deleteProfile(user._id).unwrap();
        toast({
          variant: "default",
          title: "Success",
          description: result.message,
        });

        refetchUserData();
      }
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="">Remove Profile Picture</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure you?</DialogTitle>
          <DialogDescription>
            This will remove you profile picture
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleRemove}
            disabled={!user.picture || isLoading}
          >
            {isLoading ? "Removing..." : "Remove"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileRemove;
