import { apiSlice } from "../apiSlice";

export const businessApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessList: builder.query({
      query: () => "/business/",
    }),
    getBusiness: builder.query({
      query: (id) => `/business/${id}`,
    }),

    addBusiness: builder.mutation({
      query: (business) => ({
        url: "/business/",
        method: "POST",
        body: { ...business },
      }),
    }),

    editBusiness: builder.mutation({
      query: (business) => ({
        url: `/business/${business._id}`,
        method: "PUT",
        body: { ...business },
      }),
    }),

    updateStatus: builder.mutation({
      query: ({ id, status, message }) => ({
        url: `/business/status/${id}`,
        method: "PATCH",
        body: { applicationStatus: status, statusMessage: message },
      }),
    }),

    addViolation: builder.mutation({
      query: ({ businessId, violation }) => ({
        url: `/business-violation/add-violation/${businessId}`,
        method: "POST",
        body: { ...violation },
      }),
    }),
  }),
});

export const {
  useGetBusinessListQuery,
  useGetBusinessQuery,
  useAddBusinessMutation,
  useEditBusinessMutation,
  useUpdateStatusMutation,
  useAddViolationMutation,
} = businessApiSlice;
