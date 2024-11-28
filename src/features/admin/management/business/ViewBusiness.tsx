import { useActiveBusinessData } from "@/hooks/dataHooks";
import { roleMap } from "@/constants";
import { formatDateTime } from "@/utils/formatTime";

import { Separator } from "@/components/ui/separator";

import {
  MapPin,
  Mail,
  Phone,
  AlignJustify,
  Link2,
  ShoppingCart,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

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

interface ProfileDetailsProps {
  title: string;
  value: string | number | JSX.Element | string[];
}

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

const ViewBusiness = () => {
  const business = useActiveBusinessData();

  const profileDetails = [
    { title: "Business Name", value: business.name },
    { title: "Address", value: business.address },
    { title: "Region", value: business.region },
    { title: "Zip Code", value: business.zip },

    { title: "Founded", value: formatDateTime(business.dateOfEstablishment) },
    { title: "Contact Person's Name", value: business.contactPersonName },
    {
      title: "Contact Person's Phone Number",
      value: `0${business.contactPersonNumber}`,
    },
    {
      title: "Contact Person's Designation",
      value: business.contactPersonDesignation,
    },
    { title: "Contact Person's Sex", value: business.contactPersonSex },

    { title: "Payment Method", value: business.paymentOption },
    {
      title: "Logistic Service Provider",
      value: business.logisticServiceProvider,
    },
    {
      title: "Industry Classification",
      value: business.industryClassification,
    },
    { title: "Product Line of Service", value: business.productLineService },
    { title: "Products", value: business.product },
    { title: "Brand Name", value: business.brandName },
    { title: "Prorietorship", value: business.type },
    { title: "Asset Size", value: business.assetSize },
    { title: "Target Sales", value: formatCurrency(business.targetSale) },
    { title: "Annual Income", value: formatCurrency(business.annualIncome) },
    {
      title: "Full-time Employees",
      value: business.fulltimeEmployee,
    },
    {
      title: "Part-time Employees",
      value: business.parttimeEmployee,
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 pb-32">
        <div className="user-profile border rounded-lg p-6 w-full md:w-4/12">
          <div className="profile-pic flex justify-center">
            <div className="bg-gray-800 w-40 h-40 rounded-full"></div>
          </div>
          <div className="flex flex-col items-center mt-4">
            <p className="font-bold">{business.user.name}</p>

            <div className="bg-gray-200 dark:bg-gray-800 px-2 rounded-full my-2">
              <p className="text-sm">
                {roleMap[business.user.role] || "Unknown Role"}
              </p>
            </div>

            <Separator className="my-4" />
          </div>

          <ProfileSection
            value={business.user.email}
            icon={<Mail size={16} />}
          />
          <ProfileSection
            value={`0${business.user.phoneNumber}`}
            icon={<Phone size={16} />}
          />
        </div>
        <div className="business-profile  border rounded-lg p-6 w-full">
          <div className="flex flex-col md:flex-row items-center gap-16 ">
            <div className="bg-gray-800 w-40 h-40  rounded-lg"></div>
            <div>
              <div className="flex items-center gap-4 mb-4 ">
                <p className="text-xl font-bold ">{business.name}</p>

                <div className="bg-gray-200 dark:bg-gray-800 px-2 rounded-full">
                  <p className="text-sm">{business.applicationStatus}</p>
                </div>
              </div>

              {business?.address && (
                <ProfileSection
                  value={business.address}
                  icon={<MapPin size={16} />}
                />
              )}

              {business?.category && (
                <ProfileSection
                  value={business.category.join(", ")}
                  icon={<AlignJustify size={16} />}
                />
              )}

              {business?.facebookPage && (
                <ProfileSection
                  value={<a>{business.facebookPage}</a>}
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
                  value={<a>{business.ecommerceSite}</a>}
                  icon={<ShoppingCart size={16} />}
                />
              )}
              {business?.website && (
                <ProfileSection
                  value={<a>{business.website}</a>}
                  icon={<Link2 size={16} />}
                />
              )}
            </div>
          </div>

          <Separator className="my-6" />
          <div>
            {profileDetails.map((section, index) => (
              <ProfileDetails
                key={index}
                title={section.title}
                value={section.value}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBusiness;
