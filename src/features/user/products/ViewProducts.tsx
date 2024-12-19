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

import { Textarea } from "@/components/ui/textarea";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ProductType } from "@/types/Product";

interface ViewProductsProps {
  form: any;
}

const ViewProducts = ({ form }: ViewProductsProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [productList, setProductList] = useState<ProductType[]>([]);

  useEffect(() => {
    const values = form.getValues().productList;
    if (Array.isArray(values)) {
      setProductList(values);
    } else {
      console.error("Expected form values to be an array");
    }
  }, [form]);

  const [newProduct, setNewProduct] = useState<ProductType>({
    name: "",
    description: "",
    picture: "",
    price: { $numberDecimal: "" },
  });

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

    setProductList([...productList, newProduct]);
    setNewProduct({
      name: "",
      description: "",
      picture: "",
      price: { $numberDecimal: "" },
    });
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number,
  ) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          if (index !== undefined) {
            setProductList(
              productList.map((product, i) => {
                if (i === index) {
                  return { ...product, picture: e.target?.result as string };
                }
                return product;
              }),
            );
          } else {
            setNewProduct({
              ...newProduct,
              picture: e.target.result as string,
            });
          }
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleRemoveProduct = (index: number) => {
    setProductList(productList.filter((_, i) => i !== index));
  };

  const handleUpdateProduct = (index: number, product: ProductType) => {
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
      form.setValue("productList", productList);
      setOpen(false);
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
            <Button>Add / Edit Products</Button>
          </DialogTrigger>

          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>Products</DialogTitle>
              <DialogDescription>
                Add, edit, or remove product
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(100vh-500px)] md:max-h-[calc(100vh-300px)]">
              {Array.isArray(productList) &&
                productList.map((product, index) => (
                  <div key={index} className="mb-4 border rounded-lg p-2">
                    <div className="flex gap-2 mb-4">
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
                        className="w-20"
                      />
                    </div>

                    <Textarea
                      value={product.description}
                      onChange={(e) =>
                        handleUpdateProduct(index, {
                          ...product,
                          description: e.target.value,
                        })
                      }
                      className="w-full mb-4"
                    />

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                      className="block w-full text-sm h-12 file:mr-4 file:px-4 file:py-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-accent hover:file:bg-primary/50 mb-2"
                    />

                    {product.picture && (
                      <div className="my-2">
                        <img
                          src={product.picture}
                          alt={product.name}
                          className="aspect-square h-20 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <Button
                      onClick={() => handleRemoveProduct(index)}
                      className="w-full"
                    >
                      Remove
                    </Button>
                  </div>
                ))}

              <div className="mb-4 border rounded-lg p-2">
                <div className="flex gap-2 mb-4">
                  <Input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    placeholder="Product Name"
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
                    placeholder="Price"
                    className="w-20"
                  />
                </div>

                <Textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description"
                  className="w-full mb-4"
                />

                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm h-12 file:mr-4 file:px-4 file:py-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-accent hover:file:bg-primary/50 mb-2"
                />

                {newProduct.picture && (
                  <div className="my-2">
                    <img
                      src={newProduct.picture}
                      alt={newProduct.name}
                      className="aspect-square h-20 object-cover rounded-lg"
                    />
                  </div>
                )}

                <Button
                  onClick={handleAddProduct}
                  disabled={
                    newProduct.name.trim() === "" ||
                    newProduct.price.$numberDecimal === "0"
                  }
                  className="w-full"
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

                <Button onClick={handleSubmit}>Submit</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ViewProducts;
