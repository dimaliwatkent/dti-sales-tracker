import * as XLSX from "xlsx-js-style";
import { Button } from "@/components/ui/button";
import { EventSaleType } from "@/types/SaleType";

interface ExcelExportProps {
  selectedEvent: EventSaleType | undefined;
}

const ExcelExport = ({ selectedEvent }: ExcelExportProps) => {
  const data = selectedEvent?.businessList;
  const fileName = selectedEvent?.title || "Sales_Report"; // Default title if no event title exists

  const exportToExcel = () => {
    if (!data) {
      console.error("No data to export");
      return;
    }

    // Extract and sort unique dates from all sales data
    const allDates = new Set<string>();
    data.forEach((item) => {
      item.saleList.forEach((sale) => {
        const saleDate = new Date(sale.createdAt).toISOString().split("T")[0];
        allDates.add(saleDate);
      });
    });
    const sortedDates = Array.from(allDates).sort();

    const headerStyle = {
      font: { bold: true, color: { rgb: "000000" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: { top: { style: "thin" }, bottom: { style: "thin" } },
      fill: { fgColor: { rgb: "F8F402" } }, // Yellow background
    };

    const defaultCellStyle = {
      font: { color: { rgb: "000000" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: { top: { style: "thin" }, bottom: { style: "thin" } },
    };

    // Worksheet Data
    const wsData: any[][] = [];

    // 1. Event Title Row (merged across all columns)
    const titleRow = [{ v: fileName.toUpperCase(), s: headerStyle }];
    wsData.push(titleRow);

    // Push an empty row after the title
    wsData.push([]);

    // 2. Header Row
    const headers = [
      { v: "MSME/Product", s: headerStyle },
      ...sortedDates.map((date) => ({ v: date, s: headerStyle })), // Dynamic dates
      { v: "Total", s: headerStyle },
    ];
    wsData.push(headers);

    // 3. Data Rows
    const columnSums = new Array(sortedDates.length).fill(0); // For column totals
    data.forEach((item) => {
      const dailySales = sortedDates.map((date, index) => {
        const saleOnDay = item.saleList
          .filter(
            (sale) =>
              new Date(sale.createdAt).toISOString().split("T")[0] === date
          )
          .reduce(
            (acc, sale) => acc + Number(sale.totalAmount.$numberDecimal),
            0
          );
        columnSums[index] += saleOnDay; // Add to column total
        return { v: saleOnDay.toFixed(2), s: defaultCellStyle };
      });

      const totalSales = dailySales.reduce(
        (sum, cell) => sum + parseFloat(cell.v),
        0
      );

      const row = [
        { v: item.name, s: defaultCellStyle }, // MSME/Product
        ...dailySales, // Sales per day
        { v: totalSales.toFixed(2), s: defaultCellStyle }, // Row total
      ];
      wsData.push(row);
    });

    // 4. Add Footer Row for Totals
    const footerRow = [
      { v: "TOTAL", s: headerStyle },
      ...columnSums.map((sum) => ({
        v: sum.toFixed(2),
        s: defaultCellStyle,
      })),
      {
        v: columnSums.reduce((sum, value) => sum + value, 0).toFixed(2),
        s: defaultCellStyle,
      },
    ];
    wsData.push(footerRow);

    // Convert to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);

    // Merge title row cells across columns
    const mergeRange = XLSX.utils.decode_range(
      `A1:${String.fromCharCode(65 + sortedDates.length)}1`
    );
    worksheet["!merges"] = [mergeRange];

    // Set Column Widths
    const columnWidths = [
      { wch: 20 }, // MSME/Product
      ...sortedDates.map(() => ({ wch: 12 })), // Date columns
      { wch: 10 }, // Total
    ];
    worksheet["!cols"] = columnWidths;

    // Add worksheet to workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName); // Worksheet name = Event title

    // Save workbook
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Button onClick={exportToExcel}>Export to Excel</Button>
    </div>
  );
};

export default ExcelExport;
