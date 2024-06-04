import React from "react";
import { useGetBusinessQuery } from "@/services/api";
import PropTypes from "prop-types";

const BusinessCard = ({ selectedBusiness }) => {
  console.log(selectedBusiness);
  const { data, isLoading, isError } = useGetBusinessQuery(selectedBusiness);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading business data.</div>;
  }

  const business = data?.business;
  console.log(data);

  return (
    <div className="business-card flex flex-col gap-2 w-96">
      <div className="flex border rounded-lg p-4 gap-4">
        <div className="w-24 h-24 bg-secondary rounded-lg"></div>
        <div>
          <p className="font-bold text-lg">{business?.name || "N/A"}</p>{" "}
          <p className="text-muted-foreground">{business?.owner || "N/A"}</p>{" "}
          <p className="text-sm text-muted-foreground">
            Booth No. :{business?.boothNumber || "N/A"}{" "}
          </p>
        </div>
      </div>

      <div className="flex gap-4 ">
        <div className="flex-grow border rounded-lg p-2">
          <p className="text-muted-foreground text-xs">Overall Sales</p>
          <p className="font-bold text-lg">
            ₱ {business?.overallSales || "N/A"}
          </p>
        </div>
        <div className="flex-grow border rounded-lg p-2">
          <p className="text-muted-foreground text-xs">Average Daily Sales</p>
          <p className="font-bold text-lg">
            ₱ {(business?.dailySales || 0).toFixed(2)}
          </p>
        </div>
      </div>
      <div>graph</div>
    </div>
  );
};

BusinessCard.propTypes = {
  selectedBusiness: PropTypes.string.isRequired,
};
export default BusinessCard;
