import { useState, useEffect } from "react";
import { useUserData } from "@/hooks/dataHooks";
import {
  useGenerateSaleQuery,
  useUpdateSaleMutation,
} from "@/api/sale/saleApiSlice";
import { useToast } from "@/components/ui/use-toast";
import { formatDateTime } from "@/utils/formatTime";
import { formatCurrency } from "@/utils/formatCurrency";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SalesProduct from "./SalesProduct";
import SalesTransaction from "./SalesTransaction";
import { Transaction } from "@/types/SaleType";
import { Sale as SaleType } from "@/types/SaleType";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SpinnerText from "@/components/SpinnerWithText";

interface TotalAmount {
  $numberDecimal: string;
}

const Sale = () => {
  const user = useUserData();

  const {
    data,
    refetch,
    isLoading: isLoadingGenerate,
  } = useGenerateSaleQuery({
    userId: user._id,
  });
  const [updateSale, { isLoading }] = useUpdateSaleMutation({});

  const sales: SaleType[] = data?.sale;

  const [saleList, setSaleList] = useState<SaleType[] | undefined>([]);
  const [activeSale, setActiveSale] = useState<SaleType | undefined>(undefined);
  const [transactionList, setTransactionList] = useState<
    Transaction[] | undefined
  >([]);
  const [transaction, setTransaction] = useState<Transaction | undefined>();
  const [totalAmount, setTotalAmount] = useState<TotalAmount | undefined>({
    $numberDecimal: "0",
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (sales && sales.length > 0) {
      const firstSale = sales[0];
      setSaleList(sales);
      setActiveSale(firstSale);
      setTransactionList(firstSale.transactionList);
      setTotalAmount(firstSale.totalAmount);
    }
  }, [sales]);

  const handleSelectChange = (value: string) => {
    const selectedSale = saleList?.find((sale) => sale._id === value);
    setActiveSale(selectedSale);
    setTransactionList(selectedSale?.transactionList);
  };

  const handleUpdateSale = async () => {
    if (activeSale) {
      try {
        const result = await updateSale({
          id: activeSale._id,
          transaction: transaction,
        }).unwrap();

        toast({
          variant: "default",
          title: "Success",
          description: result.message,
        });
        setTransaction(undefined);

        refetch();
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update sale",
        });
      }
    }
  };

  // calculate total
  useEffect(() => {
    const newTotalAmount = {
      $numberDecimal: (
        parseFloat(activeSale?.totalAmount?.$numberDecimal || "0") +
        parseFloat(transaction?.totalAmount.$numberDecimal || "0")
      ).toFixed(2),
    };
    setTotalAmount(newTotalAmount);
  }, [transaction, activeSale]);

  if (isLoadingGenerate) {
    return (
      <div>
        <SpinnerText spin={isLoadingGenerate} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center mt-4">
        <p className="text-2xl font-bold">{formatDateTime(new Date())}</p>
      </div>
      <div>
        {!saleList || saleList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <p>No ongoing event</p>
            <Button onClick={() => navigate("/events")}>Join an Event</Button>
          </div>
        ) : (
          <div>
            <div className="bg-secondary p-4 my-6 border rounded-tl-2xl rounded-bl-2xl  ml-12 -mx-8">
              <p>TOTAL SALES</p>
              <p className="text-5xl font-bold">
                {formatCurrency(totalAmount?.$numberDecimal || 0)}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between"></div>
              <div className="pb-4">
                <Select
                  value={activeSale?._id}
                  onValueChange={(value) => handleSelectChange(value)}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select Sale" />
                  </SelectTrigger>
                  <SelectContent>
                    {saleList.map((sale) => (
                      <SelectItem key={sale._id} value={sale._id}>
                        {sale.eventTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Tabs defaultValue="products" className="">
                  <TabsList>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  </TabsList>
                  <TabsContent value="products">
                    <SalesProduct
                      userId={user._id}
                      isLoading={isLoading}
                      setTransaction={setTransaction}
                      handleUpdateSale={handleUpdateSale}
                    />
                  </TabsContent>
                  <TabsContent value="transactions">
                    <SalesTransaction transactionList={transactionList} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sale;
