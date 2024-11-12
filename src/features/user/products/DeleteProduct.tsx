// BUG: When all products are deleted, 1 products remained being rendered and needs reload to disappear
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  useDeleteProductMutation,
  useGetUserProductQuery,
} from "@/api/product/productApiSlice";
import { Trash2 } from "lucide-react";
import { CustomProduct } from "@/types/CustomProduct";

interface DeleteProductProps {
  product: CustomProduct;
  productListLength: number;
  userId: string;
}

const DeleteProduct = ({
  product,
  productListLength,
  userId,
}: DeleteProductProps) => {
  const { refetch } = useGetUserProductQuery(userId);
  const [deleteProduct] = useDeleteProductMutation();
  const { toast } = useToast();

  const handleclick = async () => {
    try {
      const productData = await deleteProduct({ id: product._id }).unwrap();

      toast({
        title: "Success",
        description: productData.message,
      });
      refetch();
      // If the deleted product was the last one, reload the browser
      if (productListLength === 1) {
        window.location.reload();
      }
    } catch (error: unknown) {
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: (error as { data: { message: string } }).data.message,
        });
      }
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div className="p-2">
            <Trash2 size={16} />
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              <div>This will delete {product.name}</div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleclick}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteProduct;
