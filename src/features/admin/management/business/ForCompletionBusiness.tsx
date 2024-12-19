import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BusinessType } from "@/types/BusinessType";
import { Textarea } from "@/components/ui/textarea";

import { useToast } from "@/components/ui/use-toast";
import { useUpdateStatusMutation } from "@/api/business/businessApiSlice";

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
  business: BusinessType;
}

const ForCompletionBusiness = ({ business }: RejectBusinessProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [updateStatus, { isLoading }] = useUpdateStatusMutation();

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
          <Button className="my-2">For Completion</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>

            <DialogDescription>
              This will mark <span className="font-bold">{business.name}</span>{" "}
              for completion
            </DialogDescription>
            <div className="py-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
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
