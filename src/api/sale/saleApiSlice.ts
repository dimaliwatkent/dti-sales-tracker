import { apiSlice } from "../apiSlice";

export const saleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEventSale: builder.query({
      query: (eventId) => `/sale/event/${eventId}`,
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
  }),
});

export const {
  useGetEventSaleQuery,
  useGetRecordSaleQuery,
  useGenerateSaleQuery,
  useUpdateSaleMutation,
} = saleApiSlice;
