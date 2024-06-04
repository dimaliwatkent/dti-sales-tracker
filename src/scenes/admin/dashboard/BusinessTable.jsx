import { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetBusinessesQuery } from "@/services/api";

const BusinessTable = ({ selectedBusiness, setSelectedBusiness }) => {
  const { data, isLoading } = useGetBusinessesQuery();

  const handleRowSelect = useCallback(
    (business) => {
      setSelectedBusiness(business);
    },
    [setSelectedBusiness],
  );

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedBusiness(data[0]._id);
    }
  }, [data, setSelectedBusiness]);

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }
  return (
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
  );
};

BusinessTable.propTypes = {
  selectedBusiness: PropTypes.string.isRequired,
  setSelectedBusiness: PropTypes.func.isRequired,
};
export default BusinessTable;
