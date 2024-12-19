import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EventWithBusinessType } from "@/types/EventType";
import { formatCurrency } from "@/utils/formatCurrency";

interface BusinessTableProps {
  selectedEvent: EventWithBusinessType | undefined;
}

const BusinessTable = ({ selectedEvent }: BusinessTableProps) => {
  const businessList = selectedEvent?.businessList;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Businesses</TableHead>
            <TableHead>Total Sales</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businessList?.map((business) => {
            return (
              <TableRow key={business._id}>
                <TableCell>{business.name}</TableCell>
                <TableCell>
                  {formatCurrency(business.totalSales.$numberDecimal)}
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
