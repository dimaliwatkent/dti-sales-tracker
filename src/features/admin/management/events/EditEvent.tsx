import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { addEventSchema } from "@/zod/eventSchema";
import { useEventData } from "@/hooks/dataHooks";
import { useEditEventMutation } from "@/api/event/eventApiSlice";
import useDataLoader from "@/hooks/useDataLoader";
import SpinnerText from "@/components/SpinnerWithText";

const EditEvent = () => {
  const { toast } = useToast();

  const event = useEventData();
  const [editEvent, { isLoading }] = useEditEventMutation();
  const { isLoading: isLoadingRefetch, refetchEventList } = useDataLoader();

  const [businessIdList, setBusinessIdList] = useState<string[]>([]);

  const form = useForm<z.infer<typeof addEventSchema>>({
    resolver: zodResolver(addEventSchema),
    defaultValues: {
      title: event.title,
      location: event.location,
      startDate: event.startDate.split("T")[0],
      endDate: event.endDate.split("T")[0],
      applicationStart: event.applicationStart.split("T")[0],
      applicationEnd: event.applicationEnd.split("T")[0],
      status: event.status,
      businessList: event.businessList.map((business) => business._id),
      booth: [],
    },
  });

  const navigate = useNavigate();

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
        const updatedFormData = { ...data, businessList: businessIdList };

        const result = await editEvent({
          id: event._id,
          event: updatedFormData,
        }).unwrap();

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
  useEffect(() => {
    if (event.businessList) {
      setBusinessIdList(event.businessList.map((business) => business._id));
    }
  }, []);

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
        <p className="text-3xl font-bold mb-6">Edit Event</p>
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
                  <Input {...field} />
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
    </div>
  );
};

export default EditEvent;
