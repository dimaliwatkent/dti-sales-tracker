import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  useAddProductMutation,
} from "@/api/product/productApiSlice";
import { useProductListData, useUserData } from "@/hooks/dataHooks";
import { CustomProduct } from "@/types/CustomProduct";
import { ScrollArea } from "@/components/ui/scroll-area";
import useDataLoader from "@/hooks/useDataLoader";

interface ViewProductsProps {
  eventId: string;
}

const ViewProducts = ({ eventId }: ViewProductsProps) => {
  const user = useUserData();
  const customProducts = useProductListData();
  const {refetchProductList} = useDataLoader()

  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [productList, setProductList] = useState<CustomProduct[]>([]);
  const [newProduct, setNewProduct] = useState<CustomProduct>({
    user: user._id,
    event: eventId,
    name: "",
    price: { $numberDecimal: "0" },
  });

  useEffect(() => {
    if (customProducts) {
      const filteredProducts = customProducts.filter(
        (product: CustomProduct) => product.event === eventId,
      );
      setProductList(filteredProducts);
    }
  }, [customProducts, eventId]);

  const handleAddProduct = () => {
    if (
      newProduct.name.trim() === "" ||
      !/^\d+(\.\d+)?$/.test(newProduct.price.$numberDecimal)
    ) {
      console.log("error");
      toast({
        variant: "destructive",
        title: "Please enter a valid product name and price.",
      });
      return;
    }

    const product = {
      ...newProduct,
      user: user._id,
      event: eventId,
    };
    setProductList([...productList, product]);
    setNewProduct({
      user: user._id,
      event: eventId,
      name: "",
      price: { $numberDecimal: "0" },
    });
  };

  const handleRemoveProduct = (index: number) => {
    setProductList(productList.filter((_, i) => i !== index));
  };

  const handleUpdateProduct = (index: number, product: CustomProduct) => {
    setProductList(productList.map((p, i) => (i === index ? product : p)));
  };

  const handleSubmit = async () => {
    const invalidProducts = productList.filter(
      (product) =>
        product.name.trim() === "" ||
        !/^\d+(\.\d+)?$/.test(product.price.$numberDecimal),
    );

    if (invalidProducts.length > 0) {
      toast({
        variant: "destructive",
        title: "Please enter a valid product name and price for all products.",
      });
      return;
    }

    try {
      const result = await addProduct({
        eventId: eventId,
        userId: user._id,
        productList: productList,
      }).unwrap();

      toast({
        title: "Success",
        description: result.message,
      });
      refetchProductList()
      setOpen(false)
    } catch (error: unknown) {
      if (error) {
        toast({
          variant: "destructive",
          title: (error as { data: { message: string } }).data.message,
          description: (error as { data: { err: string } }).data.err,
        });
      }
    }
  };

  return (
    <div className="flex flex-col justify-start items-start">
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Products</Button>
          </DialogTrigger>

          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>Products</DialogTitle>
              <DialogDescription>
                Add, edit, or remove product
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(100vh-500px)] md:max-h-[calc(100vh-300px)]">
              {productList.map((product, index) => (
                <div key={index} className="flex gap-4 mb-4">
                  <Input
                    type="text"
                    value={product.name}
                    onChange={(e) =>
                      handleUpdateProduct(index, {
                        ...product,
                        name: e.target.value,
                      })
                    }
                    className="w-full"
                  />
                  <Input
                    type="text"
                    value={product.price.$numberDecimal}
                    onChange={(e) =>
                      handleUpdateProduct(index, {
                        ...product,
                        price: { $numberDecimal: e.target.value },
                      })
                    }
                    className="w-full"
                  />
                  <Button
                    onClick={() => handleRemoveProduct(index)}
                    className=""
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <div className="flex gap-4 mb-4">
                <Input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full"
                />
                <Input
                  type="text"
                  value={newProduct.price.$numberDecimal}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: { $numberDecimal: e.target.value },
                    })
                  }
                  className="w-full"
                />
                <Button
                  onClick={handleAddProduct}
                  disabled={
                    newProduct.name.trim() === "" ||
                    newProduct.price.$numberDecimal === "0"
                  }
                  className=""
                >
                  Add
                </Button>
              </div>
            </ScrollArea>
            <div className="flex justify-end mt-8">
              <div>
                <Button
                  variant="secondary"
                  onClick={() => setOpen(false)}
                  className="mr-4"
                >
                  Cancel
                </Button>

                <Button onClick={handleSubmit}>
                  {isLoading ? "Loading..." : "Submit"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ViewProducts;
