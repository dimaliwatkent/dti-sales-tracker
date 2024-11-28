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

import { useEditBusinessMutation } from "@/api/business/businessApiSlice";

import { editApplicationSchema } from "@/zod/applicationSchema";
import useDataLoader from "@/hooks/useDataLoader";
import { MultiSelect } from "./MultiSelect";
import ReviewForm from "./ReviewForm";

import { selectActiveBusiness } from "@/api/business/businessSlice";
import { useUserData } from "@/hooks/dataHooks";
import SpinnerText from "@/components/SpinnerWithText";

const EditApplicationForm = () => {
  const event = useSelector(selectEvent);
  const business = useSelector(selectActiveBusiness);
  const { refetchUserEventList } = useDataLoader();
  const [agreed, setAgreed] = useState(true);
  const user = useUserData();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof editApplicationSchema>>({
    resolver: zodResolver(editApplicationSchema),
    defaultValues: {
      _id: business?._id ?? "",
      event: business?.event ?? "",
      user: user?._id,
      name: business?.name ?? "",
      address: business?.address ?? "",
      region: business?.region ?? "",
      zip: business?.zip ?? "",
      logo: business?.logo ?? "",
      facebookPage: business?.facebookPage ?? "",
      ecommerceSite: business?.ecommerceSite ?? "",
      website: business?.website ?? "",
      contactPersonName: business?.contactPersonName ?? "",
      contactPersonNumber: business?.contactPersonNumber?.toString() ?? "",
      contactPersonDesignation: business?.contactPersonDesignation ?? "",
      contactPersonSex: business?.contactPersonSex ?? "",
      paymentOption: business?.paymentOption ?? [],
      logisticServiceProvider: business?.logisticServiceProvider ?? [],
      industryClassification: business?.industryClassification ?? [],
      productLineService: business?.productLineService ?? [],
      product: business?.product ?? "",
      brandName: business?.brandName ?? "",
      category: business?.category ?? [],
      type: business?.type ?? "",
      assetSize: business?.assetSize ?? "",
      targetSale: business?.targetSale ?? 0,
      fulltimeEmployee: business?.fulltimeEmployee ?? 0,
      parttimeEmployee: business?.parttimeEmployee ?? 0,
      dateOfEstablishment: business?.dateOfEstablishment.split("T")[0] ?? "",
      annualIncome: business?.annualIncome ?? 0,
      applicationStatus: "complied",
    },
  });

  const [editBusiness, { isLoading }] = useEditBusinessMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof editApplicationSchema>) => {
    try {
      const result = await editBusiness(data).unwrap();
      navigate("/events");

      toast({
        title: result.message,
        description: "Please wait for confirmation",
      });
      console.log(result.business);
      refetchUserEventList();
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
          <form className="space-y-4 pb-32">
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
                  <FormDescription>
                    Barangay, Municipality, Province
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="4A-MIMAROPA">4A-MIMAROPA</SelectItem>
                      <SelectItem value="4B-CALABARZON">
                        4B-CALABARZON
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="4900" {...field} />
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
              name="contactPersonName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person's Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Dela Cruz" {...field} />
                  </FormControl>
                  <FormDescription>FirstName LastName</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPersonNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person's Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543212" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPersonDesignation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person's Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="Sales Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPersonSex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person's Sex</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sex" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
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
                    options={["Cash", "Gcash", "Maya", "Bank Transfer"]}
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
                    title="Select a Logistic Service Provider"
                    options={[
                      "LBC",
                      "JRS Express",
                      "Mr. Speedy",
                      "Lalamove",
                      "Grab",
                      "Air21",
                      "Food Panda",
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
                      "Agriculture, Forestry and Fishing",
                      "Manufacturing",
                      "Wholesale and Retail Trade",
                      "Service",
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
                    title="Select product line or service"
                    options={[
                      "Clothing and Apparel",
                      "Food Processing",
                      "Furniture Production",
                      "Handicrafts and Souvenirs",
                      "Agricultural Products",
                      "Health and Beauty Products",
                      "Printing Services",
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
                  <FormLabel>Business Profile</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type of business profile" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Sole Proprietorship">
                        Sole Proprietorship
                      </SelectItem>
                      <SelectItem value="Partnership">Partnership</SelectItem>
                      <SelectItem value="Corporation">Corporation</SelectItem>
                      <SelectItem value="NGO/Cooperative">
                        NGO/Cooperative
                      </SelectItem>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Less than or Equal to 3,000,000">
                        Less than or Equal to 3,000,000
                      </SelectItem>
                      <SelectItem value="3,000,001 - 15,000,000">
                        3,000,001 - 15,000,000
                      </SelectItem>
                      <SelectItem value="15,000,001 - 100,000,000">
                        15,000,001 - 100,000,000
                      </SelectItem>
                    </SelectContent>
                  </Select>
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

export default EditApplicationForm;
