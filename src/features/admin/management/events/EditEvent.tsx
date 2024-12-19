import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { addEventSchema } from "@/zod/eventSchema";
import {
  useEditEventMutation,
  useGetEventQuery,
} from "@/api/event/eventApiSlice";
import SpinnerText from "@/components/SpinnerWithText";
import { EventType } from "@/types/EventType";

const EditEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventType>();

  const { data: eventData, isLoading: isEventLoading } = useGetEventQuery(id);

  useEffect(() => {
    if (eventData?.event) {
      setEvent(eventData?.event);
    }
  }, [eventData]);

  const { toast } = useToast();

  const [editEvent, { isLoading }] = useEditEventMutation();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof addEventSchema>>({
    resolver: zodResolver(addEventSchema),
  });

  useEffect(() => {
    if (event) {
      form.reset({
        title: eventData.event.title,
        location: eventData.event.location,
        startDate: eventData.event.startDate.split("T")[0],
        endDate: eventData.event.endDate.split("T")[0],
        applicationStart: eventData.event.applicationStart.split("T")[0],
        applicationEnd: eventData.event.applicationEnd.split("T")[0],
        status: eventData.event.status,
        isLocal: eventData.event.isLocal,
        boothList: eventData.event.boothList,
        businessList: eventData.event.businessList,
        applicantList: eventData.event.applicantList,
        documentList: eventData.event.documentList,
      });
    }
  }, [event, form]);

  const onSubmit = async (data: z.infer<typeof addEventSchema>) => {
    if (isFormDirty(form)) {
      if (new Date(data.startDate) >= new Date(data.endDate)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Start date must be before end date",
        });
        return;
      }

      try {
        const updatedFormData = { ...data };

        const result = await editEvent({
          id: event?._id,
          event: updatedFormData,
        }).unwrap();

        toast({
          variant: "default",
          title: "Success",
          description: result.message,
        });

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
    } else {
      navigate(-1);
      toast({
        title: "No changes made",
      });
    }
  };

  const isFormDirty = (form: any) => {
    return Object.keys(form.formState.dirtyFields).length > 0;
  };

  if (isLoading || isEventLoading || !eventData.event) {
    return (
      <div>
        <SpinnerText spin={isLoading || isEventLoading || !eventData.event} />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start items-start">
      <div>
        <p className="text-3xl font-bold mb-6">Edit Event</p>
      </div>
      {event && (
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isLocal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Type</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "local")}
                    defaultValue={event?.isLocal ? "local" : "non-local"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Location Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem key="local" value="local">
                        Local
                      </SelectItem>
                      <SelectItem key="non-local" value="non-local">
                        Non-Local
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
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
                  <FormLabel>End Date</FormLabel>
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

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="applicationOpen" disabled>
                        Open for Application
                      </SelectItem>
                      <SelectItem value="upcoming" disabled>
                        Upcoming
                      </SelectItem>
                      <SelectItem value="ongoing" disabled>
                        Ongoing
                      </SelectItem>
                      <SelectItem value="completed" disabled>
                        Completed
                      </SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="postponed">Postponed</SelectItem>
                    </SelectContent>
                  </Select>
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
      )}
    </div>
  );
};

export default EditEvent;
