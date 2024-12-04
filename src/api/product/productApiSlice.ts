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
      query: ({ eventId, userId, productList }) => ({
        url: `/custom-product/${eventId}/${userId}`,
        method: "POST",
        body: { productList },
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
} = productApiSlice;
