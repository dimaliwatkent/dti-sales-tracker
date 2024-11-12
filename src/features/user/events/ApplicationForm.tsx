import { useState } from "react";
import { selectEvent } from "@/api/event/eventSlice";
import { useSelector } from "react-redux";

import { X } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import AgreementForm from "./AgreementForm";

import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";

import { useAddBusinessMutation } from "@/api/business/businessApiSlice";

import { useUserData } from "@/hooks/dataHooks";

import { applicationSchema } from "@/zod/applicationSchema";
import useDataLoader from "@/hooks/useDataLoader";
import { MultiSelect } from "./MultiSelect";
import ReviewForm from "./ReviewForm";
import SpinnerText from "@/components/SpinnerWithText";

const ApplicationForm = () => {
  const event = useSelector(selectEvent);
  const { refetchUserData, refetchUserEventList } = useDataLoader();
  const [agreed, setAgreed] = useState(false);

  const { toast } = useToast();
  const user = useUserData();

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      eventId: event?._id,
      userId: user?._id,
      name: "",
      address: "",
      logo: "",
      facebookPage: "",
      ecommerceSite: "",
      website: "",
      paymentOption: [],
      logisticServiceProvider: "",
      industryClassification: [],
      productLineService: "",
      product: "",
      brandName: "",
      category: [],
      type: "",
      assetSize: 0,
      targetSale: 0,
      fulltimeEmployee: 0,
      parttimeEmployee: 0,
      dateOfEstablishment: "",
      annualIncome: 0,
    },
  });

  const [addBusiness, { isLoading }] = useAddBusinessMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof applicationSchema>) => {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    try {
      const result = await addBusiness(data).unwrap();
      navigate("/events");

      toast({
        title: result.message,
        description: "Please wait for confirmation",
      });
      refetchUserEventList();
      refetchUserData();
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
      <div className="my-6 flex flex-col items-center">
        <p className="text-2xl font-bold">{event.title}</p>
      </div>

      <div className="mt-4 mb-4">
        <p className="text-xl font-bold">Application Form</p>
      </div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pb-32"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Sweet Treats" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Tanza, Boac, Marinduque" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facebookPage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook Page</FormLabel>
                  <FormControl>
                    <Input placeholder="www.facebook.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ecommerceSite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ecommerce Site</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://www.lazada.com.ph/shop/sweet-treats"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Shopee or Lazada Link</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="sweet-treats.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentOption"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Option</FormLabel>

                  <div className="flex flex-wrap gap-2">
                    {field.value.length > 0
                      ? field.value.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 rounded-full px-3 bg-[hsl(var(--chart-1))]"
                            onClick={() => {
                              field.onChange(
                                field.value.filter((i) => i !== item),
                              );
                            }}
                          >
                            {item} <X size={10} />
                          </div>
                        ))
                      : ""}
                  </div>
                  <MultiSelect
                    title="Select Payment Option"
                    options={["cash", "gcash", "maya"]}
                    selectedItem={field.value}
                    setSelectedItem={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logisticServiceProvider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logistic Service Provider</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industryClassification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry Classification</FormLabel>

                  <div className="flex flex-wrap gap-2">
                    {field.value.length > 0
                      ? field.value.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 rounded-full px-3 bg-[hsl(var(--chart-1))]"
                            onClick={() => {
                              field.onChange(
                                field.value.filter((i) => i !== item),
                              );
                            }}
                          >
                            {item} <X size={10} />
                          </div>
                        ))
                      : ""}
                  </div>
                  <MultiSelect
                    title="Select Industry Classification"
                    options={[
                      "manufacturing",
                      "service",
                      "retail",
                      "wholesale",
                    ]}
                    selectedItem={field.value}
                    setSelectedItem={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productLineService"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Line or Service</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Products</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Apple, Banana, Coconut"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    List here all your products seperated by comma
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brandName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>

                  <div className="flex flex-wrap gap-2">
                    {field.value.length > 0
                      ? field.value.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 rounded-full px-3 bg-[hsl(var(--chart-1))]"
                            onClick={() => {
                              field.onChange(
                                field.value.filter((i) => i !== item),
                              );
                            }}
                          >
                            {item} <X size={10} />
                          </div>
                        ))
                      : ""}
                  </div>
                  <MultiSelect
                    title="Select Category"
                    options={["food", "non-food", "service"]}
                    selectedItem={field.value}
                    setSelectedItem={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type of business" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sole proprietorship">
                        Sole Proprietorship
                      </SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="corporation">Corporation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assetSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Size</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetSale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Sales</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fulltimeEmployee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Full-time Employees</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parttimeEmployee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Part-time Employees</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="annualIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Income</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfEstablishment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Establishment</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <AgreementForm agreed={agreed} setAgreed={setAgreed} />
              <ReviewForm
                formData={form.watch()}
                onSubmit={form.handleSubmit(onSubmit)}
                agreed={agreed}
                isLoading={isLoading}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ApplicationForm;
