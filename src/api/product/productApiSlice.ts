import { apiSlice } from "../apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProduct: builder.query({
      query: (userId) => `/custom-product/user/${userId}`,
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

export const { useGetUserProductQuery, useAddProductMutation } =
  productApiSlice;
