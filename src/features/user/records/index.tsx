import { useGetRecordSaleQuery } from "@/api/sale/saleApiSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBusinessData } from "@/hooks/dataHooks";
import { useEffect, useState } from "react";

import { SalesRecord } from "@/types/SaleType";
import SpinnerText from "@/components/SpinnerWithText";

const Records = () => {
  const business = useBusinessData();
  const [activeSalesRecord, setActiveSalesRecord] = useState<
    SalesRecord | undefined
  >(undefined);
  const [salesRecord, setSalesRecord] = useState<SalesRecord[] | undefined>(
    undefined,
  );

  const { data, isLoading } = useGetRecordSaleQuery({
    businessId: business._id,
  });

  useEffect(() => {
    if (data?.salesRecord) {
      setActiveSalesRecord(data?.salesRecord[0]);
      setSalesRecord(data?.salesRecord);
    }
  }, [data]);

  const handleSelectChange = (value: string) => {
    const selectedSale = salesRecord?.find(
      (record) => record.eventId === value,
    );
    setActiveSalesRecord(selectedSale);
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
      {!salesRecord || salesRecord.length === 0 ? (
        <p>No sales records</p>
      ) : (
        <div className="pb-4">
          <Select
            value={activeSalesRecord?.eventId}
            onValueChange={(value) => handleSelectChange(value)}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Select Sale" />
            </SelectTrigger>
            <SelectContent>
              {salesRecord.map((record) => (
                <SelectItem key={record.eventId} value={record.eventId}>
                  {record.eventTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default Records;
