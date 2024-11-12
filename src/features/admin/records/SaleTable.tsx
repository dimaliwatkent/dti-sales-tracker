// import { Sale } from "@/types/SaleType";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/utils/formatTime";
import { Record } from "@/types/RecordType";
import { formatCurrency } from "@/utils/formatCurrency";
import ExcelExport from "./ExcelExport";

interface SaleTableProps {
  activeEvent: Record | undefined;
}

const SaleTable = ({ activeEvent }: SaleTableProps) => {
  const currentDate = new Date();
  const formattedCurrentDate = formatDateTime(currentDate);
  const businessList = activeEvent?.businessList;

  return (
    <div>
      <div>
        <div className="flex justify-between items-center my-4">
          <p className="text-2xl font-bold">{formattedCurrentDate}</p>
          <ExcelExport activeEvent={activeEvent} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {businessList?.map((business) => (
          <div key={business.businessId} className="border rounded-md p-4">
            <h2 className="text-lg font-bold ">{business.businessName}</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Sale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {business.dailySales.map((sale) => (
                  <TableRow key={sale.saleId}>
                    <TableCell>{formatDateTime(sale.createdAt)}</TableCell>
                    <TableCell>{formatCurrency(sale.totalSales)}</TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableHead>Total</TableHead>
                  <TableCell>{formatCurrency(business.totalAmount)}</TableCell>
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
