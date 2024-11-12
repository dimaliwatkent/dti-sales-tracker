import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Business } from "@/types/BusinessType";
import { Textarea } from "@/components/ui/textarea";

import { useToast } from "@/components/ui/use-toast";
import { useUpdateStatusMutation } from "@/api/business/businessApiSlice";
import useDataLoader from "@/hooks/useDataLoader";
import { setEvent } from "@/api/event/eventSlice";
import { useDispatch } from "react-redux";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SpinnerText from "@/components/SpinnerWithText";

const FormSchema = z.object({
  message: z
    .string()
    .min(5, {
      message: "Bio must be at least 5 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 30 characters.",
    }),
});

interface RejectBusinessProps {
  business: Business;
}

const ForCompletionBusiness = ({ business }: RejectBusinessProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [updateStatus, { isLoading }] = useUpdateStatusMutation();
  const { isLoading: isLoadingRefetch, refetchEventList } = useDataLoader();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const result = await updateStatus({
        id: business._id,
        status: "forcompletion",
        message: data.message,
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
          <Button className="my-2">For Completion</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              This will mark {business.name} for completion
            </DialogTitle>
            <div className="py-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-2/3 space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>For Completion Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your message here"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ForCompletionBusiness;
