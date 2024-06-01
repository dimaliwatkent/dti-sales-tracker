import React from "react";
import { useGetBusinessQuery } from "@/services/api";

const Dashboard = () => {
  const { data } = useGetBusinessQuery();
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
