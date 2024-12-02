import { apiSlice } from "../apiSlice";

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadProfile: builder.mutation({
      query: (formData) => ({
        url: `/upload/profile`,
        method: "POST",
        body: formData,
      }),
    }),

    deleteProfile: builder.mutation({
      query: (userId) => ({
        url: `/upload/profile/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useUploadProfileMutation, useDeleteProfileMutation } =
  uploadApiSlice;
