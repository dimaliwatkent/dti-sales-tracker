import React from "react";
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

const Sales = () => {
  const user = useSelector((state) => state.user.currentUser);
  const businessId = user.business;
  const { data, isLoading, refetch } = useGetSalesQuery(businessId);
  const { data: productData, loading: isProductLoading } =
    useGetProductsQuery(businessId);

  if (isLoading || !data?.sale) return <div>Loading...</div>;
  const { sale } = data;

  const deleteProductFromSale = async (productId) => {
    try {
      // Construct the URL for the DELETE request
      const url = "http://localhost:3000/user/sales/removeproduct";

      // Send the DELETE request using fetch
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
      <div>Date</div>
      <p>Total Price: {sale.totalPrice} PHP</p>
      <AddProduct products={productData} saleId={sale._id} refetch={refetch} />
      <div>
        {sale.products.map((product) => (
          <div key={product._id}>
            <Card>
              <CardHeader>
                <CardTitle>{product.productId.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Price: {product.productId.price} PHP</p>
                <div>
                  <p>Quantity: {product.quantity} PHP</p>
                  <Button>Subtract quantity</Button>
                  <Button>Add quantity</Button>
                </div>
                {!product.productId.under_nego && (
                  <em>(Not under negotiation)</em>
                )}
              </CardContent>
              <CardFooter>
                <div>
                  B
                  <Button
                    onClick={() => deleteProductFromSale(product.productId._id)}
                  >
                    Delete
                  </Button>
                  <Button>Edit</Button>
                </div>
              </CardFooter>
            </Card>
            <div></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sales;
