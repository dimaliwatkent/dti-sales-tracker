import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { editProductSchema } from "@/zod/productSchema";
import {
  useEditProductMutation,
  useGetUserProductQuery,
} from "@/api/product/productApiSlice";

import { Pencil } from "lucide-react";
import { CustomProduct } from "@/types/CustomProduct";

interface EditProductProps {
  product: CustomProduct;
  userId: string;
}

const EditProduct = ({ product, userId }: EditProductProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editProduct, { isLoading }] = useEditProductMutation();

  const { refetch } = useGetUserProductQuery(userId);

  const form = useForm<z.infer<typeof editProductSchema>>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      userId: product.user,
      name: product.name,
      price: product.price.$numberDecimal,
    },
  });

  const onSubmit = async (data: z.infer<typeof editProductSchema>) => {
    try {
      const result = await editProduct({
        id: product._id,
        product: data,
      }).unwrap();

      toast({
        title: "Success",
        description: result.message,
      });
      refetch();

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
            <div className="p-2">
              <Pencil size={16} />
            </div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Edit product by filling up the form
              </DialogDescription>
            </DialogHeader>
            <div className="grid w-full items-center gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Loading..." : "Submit"}
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EditProduct;
