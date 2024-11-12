import { apiSlice } from "../apiSlice";

export const saleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEventSale: builder.query({
      query: (eventId) => `/sale/event/${eventId}`,
    }),

    getArchivedSales: builder.query({
      query: () => "/sale?isArchived=true",
    }),

    getSale: builder.query({
      query: (id) => `/sale/${id}`,
    }),

    getRecordSale: builder.query({
      query: () => `/sale/record/event`,
    }),

    generateSale: builder.query({
      query: ({ userId }) => `/sale/generate/${userId}`,
    }),

    updateSale: builder.mutation({
      query: ({ id, transaction }) => ({
        url: `/sale/${id}`,
        method: "PATCH",
        body: { transaction },
      }),
    }),

    archiveSale: builder.mutation({
      query: ({ id, isArchived }) => ({
        url: `/sale/${id}`,
        method: "PATCH",
        body: { isArchived },
      }),
    }),
  }),
});

export const {
  useGetEventSaleQuery,
  useGetArchivedSalesQuery,
  useGetSaleQuery,
  useGetRecordSaleQuery,
  useGenerateSaleQuery,
  useUpdateSaleMutation,
  useArchiveSaleMutation,
} = saleApiSlice;
