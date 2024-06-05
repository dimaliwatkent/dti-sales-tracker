import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dti-sales-tracker.netlify.app/.netlify/functions/api",
  }),
  reducerPath: "api",
  tagTypes: ["Business", "Products", "Sales", "User"],
  endpoints: (build) => ({
    getBusinesses: build.query({
      query: () => "admin/businesses",
    }),
    getBusiness: build.query({
      query: (businessId) => `admin/businesses/${businessId}`,
    }),

    getSales: build.query({
      query: (businessId) => `user/sales/${businessId}`,
    }),
    getProducts: build.query({
      query: (businessId) => `user/products/${businessId}`,
    }),
  }),
});

export const {
  useGetBusinessesQuery,
  useGetBusinessQuery,
  useGetSalesQuery,
  useGetProductsQuery,
} = api;
