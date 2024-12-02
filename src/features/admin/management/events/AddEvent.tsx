import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { addEventSchema } from "@/zod/eventSchema";
import { useAddEventMutation } from "@/api/event/eventApiSlice";
import useDataLoader from "@/hooks/useDataLoader";
import SpinnerText from "@/components/SpinnerWithText";

const AddEvent = () => {
  const { toast } = useToast();
  const [addEvent, { isLoading }] = useAddEventMutation();
  const { isLoading: isLoadingRefetch, refetchEventList } = useDataLoader();

  const form = useForm<z.infer<typeof addEventSchema>>({
    resolver: zodResolver(addEventSchema),
    defaultValues: {
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      applicationStart: "",
      applicationEnd: "",
      status: "upcoming",
      businessList: [],
      booth: [],
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof addEventSchema>) => {
    if (new Date(data.startDate) >= new Date(data.endDate)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Start date must be before end date",
      });
      return;
    }

    try {
      const result = await addEvent(data).unwrap();
      toast({
        variant: "default",
        title: "Success",
        description: result.message,
      });

      refetchEventList();
      navigate(-1);
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
    <div className="flex flex-col justify-start items-start">
      <div>
        <p className="text-3xl font-bold mb-6">Add Event</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Boac, Marinduque"{...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Start Date</FormLabel>
                <FormControl>
                  <Input placeholder="" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event End Date</FormLabel>
                <FormControl>
                  <Input placeholder="" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicationStart"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Start Date</FormLabel>
                <FormControl>
                  <Input placeholder="" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="applicationEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application End Date</FormLabel>
                <FormControl>
                  <Input placeholder="" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 w-full justify-end items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" className="my-2">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddEvent;
