import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAddEventViolationMutation } from "@/api/violation/violationApiSlice";
import { Input } from "@/components/ui/input";

const addEventViolationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  fee: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: "Price must be a valid number" }),
  description: z
    .string()
    .trim()
    .min(3, "Description is required")
    .max(500, "Description must be 500 characters or less"),
});

interface AddEventViolationProps {
  eventId: string;
  refetch: () => void;
}

const AddEventViolation = ({ eventId, refetch }: AddEventViolationProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const [addEventViolation, { isLoading }] = useAddEventViolationMutation();

  const form = useForm<z.infer<typeof addEventViolationSchema>>({
    resolver: zodResolver(addEventViolationSchema),
    defaultValues: {
      name: "",
      fee: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof addEventViolationSchema>) => {
    try {
      const result = await addEventViolation({
        eventId: eventId,
        violation: data,
      }).unwrap();

      toast({
        title: "Success",
        description: result.message,
      });
      setOpen(false);
      refetch();
      form.reset();
    } catch (error: unknown) {
      if (error) {
        toast({
          variant: "destructive",
          title: (error as { data: { message: string } }).data.message,
          description: (error as { data: { error: string } }).data.error,
        });
      }
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>Add Violation</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Violation</DialogTitle>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name of Violation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fee</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Fee for Violation"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Description of Violation"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Loading..." : "Submit"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddEventViolation;
