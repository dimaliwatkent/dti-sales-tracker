import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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
import { useAddEventMutation } from "@/api/event/eventApiSlice";
import SpinnerText from "@/components/SpinnerWithText";
import { useState } from "react";

const AddEvent = () => {
  const { toast } = useToast();
  const [addEvent, { isLoading }] = useAddEventMutation();
  const [fileNames, setFileNames] = useState<string[]>([]);

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
      documentList: [],
      isLocal: undefined,
      boothList: [],
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

  if (isLoading) {
    return (
      <div>
        <SpinnerText spin={isLoading} />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start items-start pb-32">
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
                  <Input placeholder="Boac, Marinduque" {...field} />
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

          <FormField
            control={form.control}
            name="documentList"
            render={() => (
              <FormItem>
                <FormLabel>Requirements</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const files = e.target.files;
                      const base64Files: string[] = [];
                      const newFileNames: string[] = [];

                      // Convert each file to base64
                      if (files) {
                        Array.from(files).forEach((file: File) => {
                          newFileNames.push(file.name);
                          const reader = new FileReader();
                          reader.readAsDataURL(file);
                          reader.onload = () => {
                            if (reader.result) {
                              const base64String = `filename: ${file.name}; ${reader.result as string}`;
                              base64Files.push(base64String);
                              form.setValue("documentList", base64Files);
                            }
                          };
                        });
                      }
                      setFileNames(newFileNames);
                    }}
                    className="block w-full text-sm h-12
            file:mr-4 file:px-4 file:py-2
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-accent
            hover:file:bg-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {fileNames &&
            fileNames.map((name, index) => <div key={index}>{name}</div>)}

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
