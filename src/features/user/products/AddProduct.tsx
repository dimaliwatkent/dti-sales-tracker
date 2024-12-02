import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
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
import { Plus } from "lucide-react";

import { addProductSchema } from "@/zod/productSchema";
import {
  useAddProductMutation,
  useGetUserProductQuery,
} from "@/api/product/productApiSlice";

interface AddProductProps {
  userId: string;
}

const AddProduct = ({ userId }: AddProductProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [addProduct, { isLoading }] = useAddProductMutation();

  const { refetch } = useGetUserProductQuery(userId);

  const form = useForm<z.infer<typeof addProductSchema>>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      userId: userId,
      name: "",
      price: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof addProductSchema>) => {
    try {
      const result = await addProduct(data).unwrap();

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
            <div className="rounded-full p-2 bg-foreground text-background">
              <Plus strokeWidth={3} size={40} />
            </div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>
                Add product by filling up the form
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
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -mt-2.5 text-sm text-muted-foreground">
                              ₱
                            </span>
                            <Input {...field} className="pl-6" />
                          </div>
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

export default AddProduct;
