import { BusinessType } from "@/types/BusinessType";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDateTime } from "@/utils/formatTime";

import { Separator } from "@/components/ui/separator";

import { MapPin, AlignJustify, Link2, ShoppingCart } from "lucide-react";
import PicturePopUp from "@/components/PicturePopUp";

interface BusinessProfileProps {
  business: BusinessType | undefined;
}

interface ProfileDetailsProps {
  title: string;
  value: string | number | JSX.Element | string[];
}

interface ProfileSectionProps {
  title?: string;
  value: string | number | JSX.Element;
  icon?: JSX.Element;
}

const ProfileSection = ({ value, icon }: ProfileSectionProps) => {
  return (
    <div className="flex items-center gap-2 m-1">
      <div>{icon}</div>
      <div>{value}</div>
    </div>
  );
};

const ProfileDetails = ({ title, value }: ProfileDetailsProps) => {
  return (
    <div className="grid grid-cols-2 items-center gap-2">
      <p className="text-primary/70">{title}</p>
      <div className="text-left">
        {Array.isArray(value) ? value.join(", ") : value}
      </div>
    </div>
  );
};

const BusinessProfile = ({ business }: BusinessProfileProps) => {
  const productList = business?.productList || [];
  const documents = business?.documentList || [];

  const profileDetails = [
    { title: "Business Name", value: business?.name },
    { title: "Booth Number", value: business?.boothNumber },
    { title: "Address", value: business?.address },
    { title: "Region", value: business?.region },
    { title: "Zip Code", value: business?.zip },

    { title: "Founded", value: formatDateTime(business?.dateOfEstablishment) },
    { title: "Contact Person's Name", value: business?.contactPersonName },
    {
      title: "Contact Person's Phone Number",
      value: `0${business?.contactPersonNumber}`,
    },
    {
      title: "Contact Person's Designation",
      value: business?.contactPersonDesignation,
    },
    { title: "Contact Person's Sex", value: business?.contactPersonSex },

    { title: "Payment Method", value: business?.paymentOption },
    {
      title: "Logistic Service Provider",
      value: business?.logisticServiceProvider,
    },
    {
      title: "Industry Classification",
      value: business?.industryClassification,
    },
    { title: "Product Line of Service", value: business?.productLineService },
    { title: "Brand Name", value: business?.brandName },
    { title: "Prorietorship", value: business?.type },
    { title: "Asset Size", value: business?.assetSize },
    {
      title: "Annual Income",
      value: formatCurrency(business?.annualIncome || ""),
    },
    {
      title: "Full-time Employees",
      value: business?.fulltimeEmployee,
    },
    {
      title: "Part-time Employees",
      value: business?.parttimeEmployee,
    },
  ];

  const docTypeMap: { [key: string]: string } = {
    ["waiver"]: "Waiver of Claims",
    ["signed-terms"]: "Signed Terms and Condition",
    ["payment-qr"]: "Digital Payment QR Code",
    ["business-name-reg"]: "Business Name Registration (DTI, SEC, CDA)",
    ["valid-id"]: "Valid ID of the Owner",
    ["menu-copy"]: "Photocopy of the Menu",
    ["product-photos"]: "Photos of the products to be sold",
  };

  return (
    <div className="business-profile border rounded-lg p-6">
      <div className="flex flex-col md:flex-row items-center gap-16 ">
        {business?.logo ? (
          <div className="aspect-square h-40 rounded-lg overflow-hidden">
            <img
              src={business?.logo}
              alt="profile-picture"
              className="object-cover h-full w-full"
            />
          </div>
        ) : (
          <div className="aspect-square h-40 bg-secondary rounded-lg" />
        )}
        <div>
          <div className="flex items-center gap-4 mb-4 ">
            <p className="text-xl font-bold ">{business?.name}</p>

            <div className="bg-gray-200 dark:bg-gray-800 px-2 rounded-full">
              <p className="text-sm">{business?.applicationStatus}</p>
            </div>
          </div>

          {business?.address && (
            <ProfileSection
              value={business?.address}
              icon={<MapPin size={16} />}
            />
          )}

          {business?.category && (
            <ProfileSection
              value={business?.category.join(", ")}
              icon={<AlignJustify size={16} />}
            />
          )}

          {business?.facebookPage && (
            <ProfileSection
              value={<a>{business?.facebookPage}</a>}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-facebook"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              }
            />
          )}

          {business?.ecommerceSite && (
            <ProfileSection
              value={<a>{business?.ecommerceSite}</a>}
              icon={<ShoppingCart size={16} />}
            />
          )}
          {business?.website && (
            <ProfileSection
              value={<a>{business?.website}</a>}
              icon={<Link2 size={16} />}
            />
          )}
        </div>
      </div>

      <Separator className="my-6" />

      <div className="space-y-3">
        {profileDetails.map((section, index) => (
          <ProfileDetails
            key={index}
            title={section.title}
            value={section.value || ""}
          />
        ))}
      </div>

      <p className="text-xl font-bold mt-6 mb-2">Product List</p>
      <div className="space-y-3">
        {productList &&
          productList.map((product, index: number) => (
            <div key={index} className="border rounded-lg p-2">
              <div className="flex gap-2">
                {product.picture && <PicturePopUp picture={product.picture} />}
                <div className="w-full">
                  <div className=" flex justify-between">
                    <p>{product.name}</p>

                    <p>{formatCurrency(product.price.$numberDecimal)}</p>
                  </div>
                  <p className="text-sm text-primary/60">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      <p className="text-xl font-bold mt-6 mb-2">Requirements</p>

      <div className="space-y-3">
        {documents &&
          documents.map((doc) => (
            <div key={doc._id}>
              <div className="grid grid-cols-2 items-center gap-2">
                <p className="text-primary/70">
                  {docTypeMap[doc.documentType]}
                </p>
                <div className="text-left bg-primary h-8 w-32 flex items-center justify-center rounded-lg hover:scale-105">
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    <p className="text-background">View File</p>
                  </a>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BusinessProfile;
