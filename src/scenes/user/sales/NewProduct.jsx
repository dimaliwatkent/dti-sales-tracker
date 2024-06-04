import { useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGetProductsQuery } from "@/services/api";

const NewProduct = ({ businessId, setValue }) => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const { refetch } = useGetProductsQuery(businessId);

  const handlePriceChange = (event) => {
    if (event.target.value < 0) {
      return;
    }
    setProductPrice(Number(event.target.value));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!productName.trim() || productPrice <= 0) {
      alert(
        "Please fill in the product name and ensure the price is greater than zero.",
      );
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/user/products/${businessId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: productName,
            price: productPrice,
            under_nego: false,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      refetch();
      setValue();
      setProductName("");
      setProductPrice(0);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error,
      );
      alert("Error", error);
    }
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>New Product</CardTitle>
          <CardDescription>Create a new product.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <form>
            <div className="space-y-1">
              <Label htmlFor="current">Product Name</Label>
              <Input
                id="product-name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">Product Price</Label>
              <Input
                id="product-price"
                value={productPrice}
                type="number"
                onChange={handlePriceChange}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex w-full justify-end mt-4">
        <Button onClick={handleSubmit}>Create</Button>
      </div>
    </div>
  );
};

NewProduct.propTypes = {
  businessId: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
};
export default NewProduct;
