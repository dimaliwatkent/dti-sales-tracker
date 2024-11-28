import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface ReviewFormProps {
  formData: { [key: string]: any };
  onSubmit: (event: any) => void;
  agreed: boolean;
  isLoading: boolean;
}

const ReviewForm = ({
  formData,
  onSubmit,
  agreed,
  isLoading,
}: ReviewFormProps) => {
  const [open, setOpen] = useState(false);

  const fields = [
    { label: "Business Name", key: "name" },
    { label: "Address", key: "address" },
    { label: "Region", key: "region" },
    { label: "Zip Code", key: "zip" },
    { label: "Logo", key: "logo" },
    { label: "Facebook Page", key: "facebookPage" },
    { label: "Ecommerce Site", key: "ecommerceSite" },
    { label: "Website", key: "website" },
    { label: "Contact Person's Name", key: "contactPersonName" },
    { label: "Contact Person's Phone Number", key: "contactPersonNumber" },
    { label: "Contact Person's Designation", key: "contactPersonDesignation" },
    { label: "Contact Person's Sex", key: "contactPersonSex" },
    { label: "Payment Option", key: "paymentOption", type: "list" },
    {
      label: "Logistic Service Provider",
      key: "logisticServiceProvider",
      type: "list",
    },
    {
      label: "Industry Classification",
      key: "industryClassification",
      type: "list",
    },
    { label: "Product Line Service", key: "productLineService", type: "list" },
    { label: "Product", key: "product" },
    { label: "Brand Name", key: "brandName" },
    { label: "Category", key: "category", type: "list" },
    { label: "Type", key: "type" },
    { label: "Asset Size", key: "assetSize" },
    { label: "Target Sale", key: "targetSale" },
    { label: "Fulltime Employee", key: "fulltimeEmployee" },
    { label: "Parttime Employee", key: "parttimeEmployee" },
    { label: "Date Of Establishment", key: "dateOfEstablishment" },
    { label: "Annual Income", key: "annualIncome" },
  ];

  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full my-2" disabled={isLoading || !agreed}>
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Review Your Form</DialogTitle>
          </DialogHeader>
          <ScrollArea className="w-full h-[calc(100vh-200px)]  overflow-y-auto p-4 ">
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={index}>
                  {field.type === "list" ? (
                    formData[field.key].length > 0 && (
                      <div className="flex items-center gap-2">
                        <p className="">{field.label}:</p>
                        <p className="font-bold">
                          {formData[field.key].join(", ")}
                        </p>
                      </div>
                    )
                  ) : (typeof formData[field.key] === "number" &&
                      formData[field.key] !== 0) ||
                    (typeof formData[field.key] === "string" &&
                      formData[field.key] !== "") ? (
                    <div className="flex items-center gap-2">
                      <p className="">{field.label}:</p>
                      <p className="font-bold">{formData[field.key]}</p>
                    </div>
                  ) : null}
                </div>
              ))}
              <div>
                <p className="text-sm text-destructive">
                  Please review your application form carefully as you will not
                  be able to make changes once submitted
                </p>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <div className="w-full">
              <Button
                variant="outline"
                className="w-full mb-4"
                onClick={() => setOpen(false)}
              >
                Go Back
              </Button>
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  onSubmit(formData);
                  setOpen(false);
                }}
              >
                Submit
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewForm;
