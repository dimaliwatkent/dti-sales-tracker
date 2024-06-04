import { useState, useEffect } from "react";
import { useGetBusinessQuery } from "@/services/api.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const { data, isLoading } = useGetBusinessQuery();
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedBusiness(data[0]._id);
    }
  }, [data]);

  const handleRowSelect = (business) => {
    setSelectedBusiness(business);
  };

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between ">
        <div className="flex-grow mr-4 border rounded-lg p-4">
          <h1 className="font-bold">Businesses</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Occupant</TableHead>
                <TableHead className="text-right">Booth No.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((business) => (
                <TableRow
                  key={business._id}
                  onClick={() => handleRowSelect(business._id)}
                  className={
                    selectedBusiness === business._id ? "bg-secondary" : ""
                  }
                >
                  <TableCell>{business.name}</TableCell>
                  <TableCell>{business.owner}</TableCell>
                  <TableCell>{business.boothNumber ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    {business.boothNumber}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="business-card flex flex-col gap-2 w-96">
          {data.find((business) => business._id === selectedBusiness) && (
            <>
              <div className="flex border rounded-lg p-4 gap-4">
                <div className="w-24 h-24 bg-secondary rounded-lg"></div>
                <div>
                  <p className="font-bold text-lg">
                    {
                      data.find((business) => business._id === selectedBusiness)
                        .name
                    }
                  </p>
                  <p className="text-muted-foreground">
                    {
                      data.find((business) => business._id === selectedBusiness)
                        .owner
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Booth No. :{" "}
                    {
                      data.find((business) => business._id === selectedBusiness)
                        .boothNumber
                    }
                  </p>
                </div>
              </div>

              <div className="flex gap-4 ">
                <div className="flex-grow border rounded-lg p-2">
                  <p className="text-muted-foreground text-xs">Total Sales</p>
                  <p className="font-bold text-lg">₱ 10000.00</p>
                </div>
                <div className="flex-grow border rounded-lg p-2">
                  <p className="text-muted-foreground text-xs">
                    Average Daily Sales
                  </p>
                  <p className="font-bold text-lg">₱ 10000.00</p>
                </div>
              </div>
              <div>graph</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
