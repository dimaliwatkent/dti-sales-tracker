import { useGetUserProductQuery } from "@/api/product/productApiSlice";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserData } from "@/hooks/dataHooks";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import DeleteProduct from "./DeleteProduct";

import { CustomProduct } from "@/types/CustomProduct";

const Products = () => {
  const user = useUserData();
  const { data } = useGetUserProductQuery(user._id);
  const productList = data?.customProduct;

  return (
    <div>
      <div>
        <ScrollArea className="w-full h-[calc(100vh-120px)]">
          <div className="pt-4 pb-32 flex flex-col gap-4 ">
            {!productList || productList.length == 0 ? (
              <div className="flex flex-col items-center gap-2">
                <p className="text-xl font-bold">No products added</p>
                <p className="text-lg">Click the Plus Sign to add a product</p>
              </div>
            ) : (
              productList.map((product: CustomProduct) => (
                <div key={product._id}>
                  <div className="p-4 border rounded-2xl">
                    <div className="flex justify-between">
                      <div className="flex gap-2">
                        <div className="bg-gray-800 w-10 h-10 rounded-full"></div>
                        <div className="">
                          <p className="font-bold">{product.name}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <p className="text-2xl">
                          ₱{" "}
                          {parseFloat(product.price.$numberDecimal).toFixed(2)}
                        </p>
                        <div className="flex">
                          <EditProduct product={product} userId={user._id} />
                          <DeleteProduct
                            product={product}
                            productListLength={productList.length}
                            userId={user._id}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="absolute bottom-28 right-6">
        <AddProduct userId={user._id} />
      </div>
    </div>
  );
};

export default Products;
