import { apiSlice } from "../apiSlice";

export const violationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessListViolation: builder.query({
      query: (eventId) => `/business-violation/${eventId}`,
    }),

    addViolation: builder.mutation({
      query: ({ businessId, violation }) => ({
        url: `/business-violation/add-violation/${businessId}`,
        method: "POST",
        body: { ...violation },
      }),
    }),
    getBusinessViolation: builder.query({
      query: (businessId) => `/business-violation/business/${businessId}`,
    }),

    markAsPaid: builder.mutation({
      query: ({ businessId, violationIds }) => ({
        url: `/business-violation/mark-paid/${businessId}`,
        method: "PATCH",
        body: { violationIds },
      }),
    }),

    getEventViolation: builder.query({
      query: (eventId) => `/violation/${eventId}`,
    }),

    addEventViolation: builder.mutation({
      query: ({ eventId, violation }) => ({
        url: `/violation/${eventId}`,
        method: "POST",
        body: { ...violation },
      }),
    }),

    deleteViolation: builder.mutation({
      query: (id) => ({
        url: `/violation/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetBusinessListViolationQuery,
  useAddViolationMutation,
  useGetBusinessViolationQuery,
  useMarkAsPaidMutation,
  useGetEventViolationQuery,
  useAddEventViolationMutation,
  useDeleteViolationMutation,
} = violationApiSlice;
