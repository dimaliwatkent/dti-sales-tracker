import { useEffect, useState } from "react";
import { selectEvent } from "@/api/event/eventSlice";
import { useSelector } from "react-redux";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import AgreementForm from "./AgreementForm";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Checkbox } from "@/components/ui/checkbox";

// form fields
import FileField from "./form-fields/FileField";
import TextInputField from "./form-fields/TextInputField";
import SelectField from "./form-fields/SelectField";
import MultiSelectField from "./form-fields/MultiSelectField";

import {
  useEditBusinessMutation,
  useGetBusinessQuery,
} from "@/api/business/businessApiSlice";

import { editApplicationSchema } from "@/zod/applicationSchema";
import ReviewForm from "./ReviewForm";
import { useUserData } from "@/hooks/dataHooks";
import SpinnerText from "@/components/SpinnerWithText";
import { BusinessType } from "@/types/BusinessType";
import ViewProducts from "../products/ViewProducts";
import { formatCurrency } from "@/utils/formatCurrency";
import AddressForm from "./form-fields/AddressForm";

const EditApplicationForm = () => {
  const { id } = useParams();
  const event = useSelector(selectEvent);

  const [business, setBusiness] = useState<BusinessType>();

  const { data: businessData, isLoading: isBusinessLoading } =
    useGetBusinessQuery(id);

  useEffect(() => {
    if (businessData?.business) {
      setBusiness(businessData?.business);
    }
  }, [businessData]);

  const [agreed, setAgreed] = useState(true);
  const user = useUserData();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof editApplicationSchema>>({
    resolver: zodResolver(editApplicationSchema),
  });

  useEffect(() => {
    if (business) {
      form.reset({
        _id: business._id,
        event: business.event,
        user: user?._id,
        name: business.name,
        address: business.address,
        region: business.region,
        zip: business.zip,
        logo: business.logo,
        facebookPage: business.facebookPage,
        ecommerceSite: business.ecommerceSite,
        website: business.website,
        contactPersonName: business.contactPersonName,
        contactPersonNumber: business.contactPersonNumber.toString(),
        contactPersonDesignation: business.contactPersonDesignation,
        contactPersonSex: business.contactPersonSex,
        paymentOption: business.paymentOption,
        logisticServiceProvider: business.logisticServiceProvider,
        industryClassification: business.industryClassification,
        productLineService: business.productLineService,
        brandName: business.brandName,
        category: business.category,
        type: business.type,
        productList: business.productList,
        assetSize: business.assetSize,
        fulltimeEmployee: business.fulltimeEmployee,
        parttimeEmployee: business.parttimeEmployee,
        dateOfEstablishment: business.dateOfEstablishment.split("T")[0],
        annualIncome: business.annualIncome,
        applicationStatus: "complied",
      });
    }
  }, [business, form]);

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

  if (isLoading || isBusinessLoading || !businessData.business) {
    return (
      <div>
        <SpinnerText
          spin={isLoading || isBusinessLoading || !businessData.business}
        />
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
            <TextInputField
              name="name"
              label="Business Name"
              type="text"
              placeholder="Sweet Treats"
              form={form}
            />

            <div>
              <div className="mb-2">
                <FormLabel>Address</FormLabel>
                <FormMessage />
              </div>
              <AddressForm form={form} />
            </div>

            <TextInputField
              name="zip"
              label="Zip Code"
              type="number"
              placeholder="4900"
              form={form}
            />
            <TextInputField
              name="facebookPage"
              label="Facebook Page"
              type="text"
              placeholder="www.facebook.com/..."
              form={form}
            />

            <TextInputField
              name="ecommerceSite"
              label="Ecommerce Site"
              type="text"
              placeholder="https://www.lazada.com.ph/shop/sweet-treats"
              description="Shopee or Lazada Link"
              form={form}
            />

            <TextInputField
              name="website"
              label="Website"
              type="text"
              placeholder="sweet-treats.com"
              form={form}
            />

            <TextInputField
              name="contactPersonName"
              label="Contact Person's Name"
              type="text"
              placeholder="Juan Dela Cruz"
              description="FirstName LastName"
              form={form}
            />

            <TextInputField
              name="contactPersonNumber"
              label="Contact Person's Number"
              type="text"
              placeholder="9876543212"
              description="Must start with 9"
              form={form}
            />

            <TextInputField
              name="contactPersonDesignation"
              label="Contact Person's Designation"
              type="text"
              placeholder="Sales Manager"
              form={form}
            />

            <SelectField
              name="contactPersonSex"
              label="Contact Person's Sex"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
              placeholder="Select a Sex"
              form={form}
            />
            <MultiSelectField
              name="paymentOption"
              label="Payment Option"
              options={["Cash", "Gcash", "Maya", "Bank Transfer"]}
              form={form}
            />

            <MultiSelectField
              name="logisticServiceProvider"
              label="Logistic Service Provider"
              options={[
                "LBC",
                "JRS Express",
                "Mr. Speedy",
                "Lalamove",
                "Grab",
                "Air21",
                "Food Panda",
              ]}
              form={form}
            />

            <MultiSelectField
              name="industryClassification"
              label="Industry Classification"
              options={[
                "Agriculture, Forestry and Fishing",
                "Manufacturing",
                "Wholesale and Retail Trade",
                "Service",
              ]}
              form={form}
            />

            <MultiSelectField
              name="productLineService"
              label="Product Line or Service"
              options={[
                "Clothing and Apparel",
                "Food Processing",
                "Furniture Production",
                "Handicrafts and Souvenirs",
                "Agricultural Products",
                "Health and Beauty Products",
                "Printing Services",
              ]}
              form={form}
            />

            <TextInputField
              name="brandName"
              label="Brand Name"
              type="text"
              placeholder="Sweet Treats"
              form={form}
            />
            <MultiSelectField
              name="category"
              label="Category"
              options={["food", "non-food", "service"]}
              form={form}
            />

            <SelectField
              name="type"
              label="Business Profile"
              options={[
                { value: "Sole Proprietorship", label: "Sole Proprietorship" },
                { value: "Partnership", label: "Partnership" },
                { value: "Corporation", label: "Corporation" },
                { value: "NGO/Cooperative", label: "NGO/Cooperative" },
              ]}
              placeholder="Select a type of business profile"
              form={form}
            />

            <SelectField
              name="assetSize"
              label="Asset Size"
              options={[
                {
                  value: "Less than or Equal to 3,000,000",
                  label: "Less than or Equal to 3,000,000",
                },
                {
                  value: "3,000,001 - 15,000,000",
                  label: "3,000,001 - 15,000,000",
                },
                {
                  value: "15,000,001 - 100,000,000",
                  label: "15,000,001 - 100,000,000",
                },
              ]}
              placeholder="Select asset size"
              form={form}
            />

            <TextInputField
              name="fulltimeEmployee"
              label="Number of Full-time Employees"
              type="number"
              form={form}
            />
            <TextInputField
              name="parttimeEmployee"
              label="Number of Part-time Employees"
              type="number"
              form={form}
            />

            <TextInputField
              name="annualIncome"
              label="Annual Income"
              type="number"
              form={form}
            />
            <TextInputField
              name="dateOfEstablishment"
              label="Date of Establishment"
              type="date"
              form={form}
            />

            <FileField
              name="logoFile"
              label="Logo"
              accept="image/*"
              form={form}
            />

            <p className="text-xl font-bold">Products</p>

            <FormField
              control={form.control}
              name="productList"
              render={({ field }) => (
                <FormItem>
                  {field.value.length > 0 ? (
                    field.value.map((product, index) => (
                      <div key={index} className="border rounded-lg p-2">
                        <div className=" flex justify-between">
                          <p>{product.name}</p>
                          <p>{formatCurrency(product.price.$numberDecimal)}</p>
                        </div>
                        <p className="text-sm text-primary/60">
                          {product.description}
                        </p>
                        {product.picture && (
                          <img
                            src={product.picture}
                            alt={product.name}
                            className="aspect-square h-20 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <div>No product added</div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <ViewProducts form={form} />

            <p className="text-xl font-bold">Requirements</p>

            <FileField
              name="waiverFile"
              label="Waiver of Claims"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
              form={form}
            />

            <FileField
              name="signedTermsFile"
              label="Signed Terms and Condition"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
              form={form}
            />

            <FileField
              name="paymentQRFile"
              label="Digital Payment QR Code"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
              form={form}
            />

            <FileField
              name="businessNameRegFile"
              label="Business Name Registration (DTI, SEC, CDA)"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
              form={form}
            />

            <FileField
              name="validIdFile"
              label="Valid ID of the Owner"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
              form={form}
            />

            <FileField
              name="menuCopyFile"
              label="Photocopy of the Menu"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
              form={form}
            />

            <div>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  checked={agreed}
                  onCheckedChange={() => setAgreed(!agreed)}
                />
                <p className="font-bold">I AGREE TO THE</p>

                <AgreementForm />
              </div>
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
