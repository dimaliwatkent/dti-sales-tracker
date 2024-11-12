import { useEffect, useMemo } from "react";
import { useGetUserProductQuery } from "@/api/product/productApiSlice";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Product as ProductType, Transaction } from "@/types/SaleType";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { formatCurrency } from "@/utils/formatCurrency";

interface SalesProductProps {
  userId: string;
  isLoading: boolean;
  setTransaction: (transaction: Transaction) => void;
  handleUpdateSale: () => void;
}

const SalesProduct = ({
  userId,
  isLoading,
  setTransaction,
  handleUpdateSale,
}: SalesProductProps) => {
  const [currentProducts, setCurrentProducts] = useState<ProductType[]>([]);
  const hasChanges = useMemo(
    () => currentProducts.length > 0,
    [currentProducts],
  );

  const { data } = useGetUserProductQuery(userId);
  const customProductList = data?.customProduct ?? [];

  const [searchTerm, setSearchTerm] = useState("");
  const [totalPrice, setTotalPrice] = useState("");

  const filteredProducts = customProductList.filter((product: ProductType) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddProduct = (product: ProductType) => {
    const existingProductIndex = currentProducts.findIndex(
      (existingProduct) => existingProduct.name === product.name,
    );

    if (existingProductIndex !== -1) {
      const updatedProducts = [...currentProducts];
      updatedProducts[existingProductIndex].quantity += 1;
      setCurrentProducts(updatedProducts);
    } else {
      const newProduct = { ...product, quantity: 1 };
      setCurrentProducts((prevProducts) => [...prevProducts, newProduct]);
    }
  };

  const handleQuantityChange = (index: number, value: number) => {
    const updatedProducts = [...currentProducts];
    updatedProducts[index].quantity = value;
    setCurrentProducts(updatedProducts);
  };

  const handleDeleteProduct = (index: number) => {
    const updatedProducts = [...currentProducts];
    updatedProducts.splice(index, 1);
    setCurrentProducts(updatedProducts);
  };

  useEffect(() => {
    const productList = currentProducts.map((product) => ({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
    }));

    const totalAmount = {
      $numberDecimal: currentProducts.reduce((acc, product) => {
        const price = parseFloat(product.price.$numberDecimal);
        return (parseFloat(acc) + price * product.quantity).toFixed(2);
      }, "0.00"),
    };

    const newTransaction = {
      date: new Date().toISOString(),
      paymentMethod: "cash",
      productList,
      totalAmount,
    };

    setTotalPrice(totalAmount.$numberDecimal);
    setTransaction(newTransaction);
  }, [currentProducts, setTransaction]);

  return (
    <div className="pb-44">
      <div className="border rounded-lg p-4 my-6 ">
        <div className="w-full max-h-36 overflow-y-auto">
          <ScrollArea className="w-full ">
            <div className="flex flex-col gap-3">
              {!currentProducts || currentProducts.length === 0 ? (
                <div>No added products</div>
              ) : (
                currentProducts.map((product: ProductType, index: number) => (
                  <div key={index} className="flex justify-between">
                    <div className="flex gap-3 items-center">
                      <p>{product.name}</p>
                    </div>

                    <div className="flex gap-3 items-center">
                      <p className="">
                        {formatCurrency(
                          (
                            parseFloat(product.price.$numberDecimal) *
                            product.quantity
                          ).toFixed(2),
                        )}
                      </p>

                      <Input
                        type="number"
                        value={product.quantity}
                        onChange={(e) =>
                          handleQuantityChange(index, parseInt(e.target.value))
                        }
                        className="w-20 text-center"
                      />

                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteProduct(index)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <p className="text-xl">Total:</p>
          <p className="font-bold text-xl">{formatCurrency(totalPrice)}</p>
        </div>
      </div>
      <div className="border rounded-lg p-4">
        <div>
          <p className="text-xl font-bold">Products</p>
          <p className="">Select a product to add</p>
        </div>

        <div className="py-4">
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search product..."
          />
        </div>

        <div className="w-full max-h-96 overflow-y-auto">
          <ScrollArea className="w-full">
            <div className="flex flex-col gap-3">
              {!filteredProducts || filteredProducts.length === 0 ? (
                <div>No custom products</div>
              ) : (
                filteredProducts.map((product: ProductType, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between cursor-pointer border p-3 rounded-lg bg-secondary active:scale-95"
                    onClick={() => handleAddProduct(product)}
                  >
                    <div className="flex gap-3 items-center">
                      <Plus size={16} />
                      <p>{product.name}</p>
                    </div>

                    <p>{formatCurrency(product.price.$numberDecimal)}</p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
      <div className="fixed md:static bottom-28 z-50 my-4">
        <Button
          className="w-[calc(100vw-50px)] md:w-full"
          disabled={!hasChanges}
          onClick={() => {
            handleUpdateSale();
            setCurrentProducts([]);
          }}
        >
          {isLoading ? "Loading..." : "Add Transaction"}
        </Button>
      </div>
    </div>
  );
};

export default SalesProduct;
