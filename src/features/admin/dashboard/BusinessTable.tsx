import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatCurrency";
import { Record } from "@/types/RecordType";

interface BusinessTableProps {
  activeEvent: Record | undefined;
}

const BusinessTable = ({ activeEvent }: BusinessTableProps) => {
  const businessList = activeEvent?.businessList;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Businesses</TableHead>
            <TableHead>Total Sales</TableHead>
            <TableHead>Target Sales</TableHead>
            <TableHead>Sales Difference</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businessList?.map((business) => {
            const salesDifference = business.totalAmount - business.targetSales;

            return (
              <TableRow key={business.businessId}>
                <TableCell>{business.businessName}</TableCell>
                <TableCell>
                  {formatCurrency(business.totalAmount.toFixed(2))}
                </TableCell>
                <TableCell>{formatCurrency(business.targetSales)}</TableCell>
                <TableCell
                  style={{
                    color: salesDifference < 0 ? "red" : "green",
                  }}
                >
                  {formatCurrency(salesDifference.toFixed(2))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default BusinessTable;
