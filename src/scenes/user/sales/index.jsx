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

const Sales = () => {
  const user = useSelector((state) => state.user.currentUser);
  const businessId = user.business;
  const { data, isLoading, refetch } = useGetSalesQuery(businessId);
  const { data: productData } = useGetProductsQuery(businessId);

  if (isLoading || !data?.sale) return <div>Loading...</div>;
  const { sale } = data;

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

      <div>
        {sale.products.length > 0 ? (
          sale.products.map(
            (
              product, // Changed parameter name to 'product'
            ) => (
              <div key={product._id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{product.productId.name}</CardTitle>{" "}
                  </CardHeader>
                  <CardContent>
                    <p>Price: ₱ {product.productId.price}.00</p>{" "}
                    <div>
                      <p>Quantity: {product.quantity}</p>{" "}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div>
                      <Button
                        onClick={() =>
                          deleteProductFromSale(product.productId._id)
                        }
                      >
                        Delete
                      </Button>
                      <Button>Edit</Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ),
          )
        ) : (
          <div className="flex justify-center p-4">
            <p>There are currently no products in sale.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sales;
