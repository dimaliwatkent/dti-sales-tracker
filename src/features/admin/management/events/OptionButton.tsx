import {
  DotsVerticalIcon,
  TrashIcon,
  Pencil1Icon,
} from "@radix-ui/react-icons";

import {
  useArchiveEventMutation,
  useGetEventListQuery,
} from "@/api/event/eventApiSlice";
import { useState, MouseEvent } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { setEvent } from "@/api/event/eventSlice";
import { useDispatch } from "react-redux";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Event } from "@/types/EventType";

interface OptionButtonProps {
  event: Event;
}

const OptionButton = ({ event }: OptionButtonProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [archiveEvent] = useArchiveEventMutation();
  const { toast } = useToast();
  const { refetch } = useGetEventListQuery({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleArchive = async (e: MouseEvent<HTMLElement>) => {
    try {
      e.stopPropagation();
      const result = await archiveEvent({
        id: String(event._id),
        isArchived: true,
      }).unwrap();
      await refetch();
      toast({
        description: result.message,
      });
    } catch (error: unknown) {
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: (error as { data: { message: string } }).data.message,
        });
      }
    }
  };

  const handleEdit = async (e: MouseEvent<HTMLElement>) => {
    try {
      e.stopPropagation();
      navigate("/admin/management/edit-event");
      dispatch(setEvent(event));
    } catch (error: unknown) {
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: (error as { data: { message: string } }).data.message,
        });
      }
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <DotsVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="gap-2" onClick={(e) => handleEdit(e)}>
            <Pencil1Icon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive gap-2"
            onClick={(e) => {
              setOpen(true);
              e.stopPropagation();
            }}
          >
            <TrashIcon />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div>
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will DELETE the event.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e: MouseEvent<HTMLElement>) => handleArchive(e)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default OptionButton;
