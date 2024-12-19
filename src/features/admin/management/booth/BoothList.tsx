import React from "react";

import { Button } from "@/components/ui/button";
import BoothAddBusiness from "./BoothAddBusiness";
import { BoothType } from "@/types/BoothType";

interface BoothListProps {
  booths: BoothType[];
  setBooths: (booths: BoothType[]) => void;
  businessList: { _id: string; name: string }[] | undefined;
}

const BoothList: React.FC<BoothListProps> = ({
  booths,
  setBooths,
  businessList,
}) => {
  const handleRemoveBooth = (code: string) => {
    setBooths(booths.filter((booth) => booth.code !== code));
  };

  const getBusinessName = (businessId: string) => {
    const business = businessList?.find(
      (business) => business._id === businessId,
    );
    return business ? business.name : "";
  };

  // Sort booths by code in ascending order
  const sortedBooths = booths.sort((a, b) => {
    // Remove non-alphanumeric characters and convert to lowercase for comparison
    const codeA = a.code.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const codeB = b.code.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    return codeA.localeCompare(codeB);
  });

  return (
    <div className="w-full p-4 rounded-lg border">
      <h2 className="text-lg font-bold mb-2">Booths</h2>
      <ul>
        {sortedBooths.length > 0 ? (
          sortedBooths.map((booth) => (
            <div
              key={booth.code}
              className="flex justify-between py-2 border-b "
            >
              <div>
                <span className="font-bold">{booth.code}</span>
                <span className="ml-2">{getBusinessName(booth.business)}</span>
              </div>
              <div className="flex gap-2">
                <BoothAddBusiness
                  selectedBooth={booth.code}
                  booths={booths}
                  setBooths={setBooths}
                  businessList={businessList}
                />
                <Button
                  variant="destructive"
                  className=""
                  onClick={() => handleRemoveBooth(booth.code)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div>
            <p className="">No booths added</p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default BoothList;
