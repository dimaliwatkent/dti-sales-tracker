import { apiSlice } from "../apiSlice";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (userId) => `/notification/${userId}`,
    }),
    markAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notification/mark-as-read/${notificationId}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkAsReadMutation } =
  notificationApiSlice;
