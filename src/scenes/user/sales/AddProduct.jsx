import { useState } from "react";
import { Trash2 } from "lucide-react";
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
import NewProduct from "./NewProduct";
import { useGetSalesQuery, useGetProductsQuery } from "@/services/api";
import { ScrollArea } from "@/components/ui/scroll-area";

const AddProduct = ({ products, saleId, businessId }) => {
  const [activeTab, setActiveTab] = useState("my-products");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const { refetch: refetchProduct } = useGetProductsQuery(businessId);
  const { refetch } = useGetSalesQuery(businessId);

  const addProductToSale = async () => {
    if (!selectedProduct) {
      alert("Please select a product.");
      return;
    }
    if (quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }
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
      }
      refetch();
      setIsOpen(false);
      setQuantity(1);
      setSelectedProduct("");
      setSelectedProductName("");
      const data = await response.json();
    } catch (error) {
      console.error(error);
      alert("Failed to add product.", error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/user/products/removeproduct/${businessId}/${productId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }

      refetchProduct();
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
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
    const productName = products.find((product) => product._id === value)?.name;
    setSelectedProductName(productName || "");
  };
  const handleQuantityChange = (event) => {
    if (event.target.value < 1) {
      return;
    }
    setQuantity(Number(event.target.value));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold">Add Product</Button>
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
                <CardTitle>
                  {selectedProductName === ""
                    ? "My Products"
                    : selectedProductName}
                </CardTitle>
                <CardDescription>Quantity</CardDescription>
                <Input
                  type="number"
                  id="quantity"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </CardHeader>
              <CardContent className="space-y-2">
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <RadioGroup
                    onValueChange={handleRadioSelection}
                    defaultValue=""
                  >
                    {products.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={product._id}
                            id={`r-${product._id}`}
                          />
                          <Label htmlFor={`r-${product._id}`}>
                            {product.name}
                          </Label>
                        </div>
                        <div className="flex gap-2 items-center">
                          <p className="text-sm">₱ {product.price}.00</p>
                          <Button
                            variant="outline"
                            className="hover:text-destructive"
                            onClick={() => handleDelete(product._id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </ScrollArea>
              </CardContent>
            </Card>
            <div className="flex w-full justify-end mt-4">
              <Button type="submit" onClick={addProductToSale}>
                Add Product
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="new-product">
            <NewProduct businessId={businessId} setValue={setValue} />
          </TabsContent>
        </Tabs>

        <DialogFooter></DialogFooter>
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
  businessId: PropTypes.string.isRequired,
};

export default AddProduct;
