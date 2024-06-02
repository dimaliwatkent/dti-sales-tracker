import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  reducerPath: "adminApi",
  tagTypes: ["Business", "Products", "Sales", "User"],
  endpoints: (build) => ({
    getBusiness: build.query({
      query: () => "admin/businesses",
    }),

    getUser: build.query({
      query: (id) => `admin/users/${id}`,
      providesTags: ["User"],
    }),
  }),
});

export const { useGetBusinessQuery, useGetUserQuery } = api;
