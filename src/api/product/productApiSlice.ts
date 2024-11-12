import { apiSlice } from "../apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductList: builder.query({
      query: () => "/custom-product/",
    }),

    getArchivedProducts: builder.query({
      query: () => "/custom-product?isArchived=true",
    }),

    getUserProduct: builder.query({
      query: (userId) => `/custom-product/user/${userId}`,
    }),

    getProduct: builder.query({
      query: (id) => `/custom-product/${id}`,
    }),

    addProduct: builder.mutation({
      query: (product) => ({
        url: "/custom-product/",
        method: "POST",
        body: { ...product },
      }),
    }),

    editProduct: builder.mutation({
      query: ({ id, product }) => ({
        url: `/custom-product/${id}`,
        method: "PUT",
        body: { ...product },
      }),
    }),

    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/custom-product/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProductListQuery,
  useGetArchivedProductsQuery,
  useGetProductQuery,
  useGetUserProductQuery,
  useAddProductMutation,
  useEditProductMutation,
  useDeleteProductMutation,
} = productApiSlice;
