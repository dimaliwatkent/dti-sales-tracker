import * as XLSX from "xlsx-js-style";
import { Button } from "@/components/ui/button";
import { Record } from "@/types/RecordType";

interface ExcelExportProps {
  activeEvent: Record | undefined;
}

const ExcelExport = ({ activeEvent }: ExcelExportProps) => {
  const data = activeEvent?.businessList;
  const fileName = `${activeEvent?.eventName}`;

  const transformedData = data?.map((item) => {
    const dailySales = item.dailySales.reduce(
      (acc: { [key: number]: number }, sale) => {
        const day = new Date(sale.createdAt).getDate();
        acc[day] = (acc[day] || 0) + sale.totalSales;
        return acc;
      },
      {},
    );

    return {
      "Target Sales": item.targetSales,
      "MSME/Product": item.businessName,
      Total: item.totalAmount,
      ...dailySales,
    };
  });

  const exportToExcel = () => {
    if (!transformedData) {
      console.error("No data to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(transformedData, {
      header: [
        "Target Sales",
        "MSME/Product",
        ...Object.keys(transformedData[0]).filter(
          (key) => !["Target Sales", "MSME/Product", "Total"].includes(key),
        ),
        "Total",
      ],
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
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
