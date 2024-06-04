import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  reducerPath: "api",
  tagTypes: ["Business", "Products", "Sales", "User"],
  endpoints: (build) => ({
    getBusiness: build.query({
      query: () => "admin/businesses",
    }),
    getSales: build.query({
      query: (businessId) => `user/sales/${businessId}`,
    }),

    getProducts: build.query({
      query: (businessId) => `user/products/${businessId}`,
    }),
  }),
});

export const { useGetBusinessQuery, useGetSalesQuery, useGetProductsQuery } =
  api;
