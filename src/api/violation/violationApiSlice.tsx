import { apiSlice } from "../apiSlice";

export const violationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useAddViolationMutation,
  useGetBusinessViolationQuery,
  useMarkAsPaidMutation,
} = violationApiSlice;
