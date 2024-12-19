import { apiSlice } from "../apiSlice";

export const boothApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooth: builder.query({
      query: (eventId) => `/event/${eventId}`,
    }),

    updateBooth: builder.mutation({
      query: ({ eventId, boothList }) => ({
        url: `/booth/${eventId}`,
        method: "POST",
        body: boothList,
      }),
    }),
  }),
});

export const { useGetBoothQuery, useUpdateBoothMutation } = boothApiSlice;
