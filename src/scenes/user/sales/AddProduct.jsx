import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PropTypes from "prop-types";

const AddProduct = ({ products, saleId, refetch }) => {
  const [activeTab, setActiveTab] = useState("my-products");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const addProductToSale = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/user/sales/addproduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            saleId,
            productId: selectedProduct,
            quantity,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        refetch();
        setIsOpen(false);
        setQuantity(0);
        setSelectedProduct("");
      }

      const data = await response.json();
      alert("Product successfully added!");
    } catch (error) {
      console.error(error);
      alert("Failed to add product.");
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  const setValue = () => {
    setActiveTab("my-products");
  };
  const handleRadioSelection = (value) => {
    setSelectedProduct(value);
  };
  const handleQuantityChange = (event) => {
    if (event.target.value < 0) {
      return;
    }
    setQuantity(Number(event.target.value));
  };
  const display = () => {
    console.log(saleId);
    console.log(selectedProduct);
    console.log(quantity);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue="my-products"
          value={activeTab}
          onValueChange={handleTabChange}
          className="border-none"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-products">My Products</TabsTrigger>
            <TabsTrigger value="new-product">New Product</TabsTrigger>
          </TabsList>
          <TabsContent value="my-products">
            <Card>
              <CardHeader>
                <CardTitle>My Products</CardTitle>
                <CardDescription>
                  Pick a product you want to add.
                </CardDescription>
                <Input
                  type="number"
                  id="quantity"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </CardHeader>
              <CardContent className="space-y-2">
                <RadioGroup
                  onValueChange={handleRadioSelection}
                  defaultValue=""
                >
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={product._id}
                        id={`r-${product._id}`}
                      />
                      <Label htmlFor={`r-${product._id}`}>{product.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="new-product">
            <Card>
              <CardHeader>
                <CardTitle>New Product</CardTitle>
                <CardDescription>Create a new product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Product Name</Label>
                  <Input id="product-name" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">Product Price</Label>
                  <Input id="product-price" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          {activeTab === "my-products" ? (
            <Button type="submit" onClick={addProductToSale}>
              Add Product
            </Button>
          ) : (
            <Button type="submit" onClick={setValue}>
              Create Product
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

AddProduct.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      under_nego: PropTypes.bool.isRequired,
      business: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      __v: PropTypes.number.isRequired,
    }),
  ),
  saleId: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
};
export default AddProduct;
