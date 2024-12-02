import { apiSlice } from "../apiSlice";

export const boothApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateBooth: builder.mutation({
      query: ({ eventId, boothList }) => ({
        url: `/booth/${eventId}`,
        method: "POST",
        body: boothList,
      }),
    }),
  }),
});

export const { useUpdateBoothMutation } = boothApiSlice;
