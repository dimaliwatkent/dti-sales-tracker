import { ScrollArea } from "@/components/ui/scroll-area";
import { Transaction } from "@/types/SaleType";
import { formatCurrency } from "@/utils/formatCurrency";

interface SalesTransactionProps {
  transactionList: Transaction[] | undefined;
}

const SalesTransaction = ({ transactionList }: SalesTransactionProps) => {
  return (
    <div className="my-6">
      <ScrollArea className="w-full h-[calc(100vh-200px)]">
        <div className="flex flex-col-reverse gap-3 pb-32">
          {!transactionList || transactionList.length === 0 ? (
            <div>No transactions</div>
          ) : (
            transactionList.map((transaction: Transaction, index: number) => (
              <div
                key={index}
                className="flex justify-between border p-4 rounded-lg"
              >
                <div>
                  <p>
                    {transaction.date.split("T")[1].split(".")[0].slice(0, 5)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <p className="bg-secondary px-3 rounded-full">
                    {transaction.paymentMethod}
                  </p>

                  <p className="bg-secondary px-3 rounded-full">
                    <span className="mr-1">
                      {transaction.productList.length}
                    </span>
                    {transaction.productList.length > 1 ? "items" : "item"}
                  </p>

                  <p>
                    {formatCurrency(transaction.totalAmount.$numberDecimal)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SalesTransaction;
