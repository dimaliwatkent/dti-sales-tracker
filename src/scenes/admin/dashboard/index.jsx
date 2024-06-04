import { useState } from "react";
import { useGetBusinessesQuery } from "@/services/api.js";
import BusinessCard from "./BusinessCard";
import BusinessTable from "./BusinessTable";

const Dashboard = () => {
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  return (
    <div>
      <div className="flex justify-between ">
        <BusinessTable
          selectedBusiness={selectedBusiness}
          setSelectedBusiness={setSelectedBusiness}
        />
        <BusinessCard selectedBusiness={selectedBusiness} />
      </div>
    </div>
  );
};

export default Dashboard;
