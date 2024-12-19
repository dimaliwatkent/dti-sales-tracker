import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/utils/formatTime";
import { formatCurrency } from "@/utils/formatCurrency";
import ExcelExport from "./ExcelExport";
import { EventSaleType } from "@/types/SaleType";

interface SaleTableProps {
  selectedEvent: EventSaleType | undefined;
}

const SaleTable = ({ selectedEvent }: SaleTableProps) => {
  const currentDate = new Date();
  const formattedCurrentDate = formatDateTime(currentDate);
  const businessList = selectedEvent?.businessList;

  return (
    <div>
      <div>
        <div className="flex justify-between items-center my-4">
          <p className="text-2xl font-bold">{formattedCurrentDate}</p>
          <ExcelExport selectedEvent={selectedEvent} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {businessList?.map((business) => (
          <div key={business._id} className="border rounded-md p-4">
            <h2 className="text-lg font-bold ">{business.name}</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Sale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {business.saleList.map((sale) => (
                  <TableRow key={sale._id}>
                    <TableCell>{formatDateTime(sale.createdAt)}</TableCell>
                    <TableCell>
                      {formatCurrency(sale.totalAmount.$numberDecimal)}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableHead>Total</TableHead>
                  <TableCell>{formatCurrency(business.totalSale)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaleTable;
