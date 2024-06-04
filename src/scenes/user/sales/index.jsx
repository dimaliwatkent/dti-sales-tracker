import { useEffect, useState } from "react";
import { useGetSalesQuery } from "@/services/api.js";
import { useGetProductsQuery } from "@/services/api.js";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddProduct from "./AddProduct";
import SalesCalendar from "./SalesCalendar";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

const Sales = () => {
  const user = useSelector((state) => state.user.currentUser);
  const businessId = user.business;
  const { data, isLoading, refetch } = useGetSalesQuery(businessId);
  const { data: productData } = useGetProductsQuery(businessId);

  if (isLoading || !data?.sale) return <div>Loading...</div>;
  const { sale } = data;
  console.log(sale);

  const deleteProductFromSale = async (productId) => {
    try {
      const url = "http://localhost:3000/user/sales/removeproduct";

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ saleId: sale._id, productId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      } else {
        refetch();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div>
      <div className="w-full flex justify-between items-end m-2">
        <div className="border p-2 rounded-lg ">
          <p className="font-bold text-5xl">₱ {sale.totalPrice}.00</p>
        </div>
        <div className="flex gap-2">
          <SalesCalendar />
          <div>
            <AddProduct
              products={productData}
              saleId={sale._id}
              businessId={businessId}
              refetch={refetch}
            />
          </div>
        </div>
      </div>
      <Separator />

      <div className="py-4">
        {sale.products.length > 0 ? (
          sale.products.map((product) => (
            <div key={product._id}>
              <Card className="py-2 px-4 mb-4">
                <div className="flex justify-between">
                  <CardTitle className="text-xl">
                    {product.productId.name}
                  </CardTitle>

                  <div className="flex gap-2 ">
                    <CardTitle className="text-2xl">
                      ₱ {product.productId.price * product.quantity}.00
                    </CardTitle>
                    <Button
                      onClick={() =>
                        deleteProductFromSale(product.productId._id)
                      }
                      size="icon"
                      className="hover:bg-destructive h-7 w-7 rounded-full"
                    >
                      <X size={20} />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Price: ₱ {product.productId.price}.00
                </p>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {product.quantity}
                  </p>
                </div>
              </Card>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center p-8 w-full">
            <p className="text-2xl font-bold">
              No products are currently on sale
            </p>
            <p className="text-sm text-muted-foreground">
              Once products are added, they will appear here.
            </p>
            <div className="mt-4">
              <AddProduct
                products={productData}
                saleId={sale._id}
                businessId={businessId}
                refetch={refetch}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
