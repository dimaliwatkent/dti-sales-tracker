import { apiSlice } from "../apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserList: builder.query({
      query: () => "/user",
    }),

    getUser: builder.query({
      query: (id) => `/user/${id}`,
    }),

    changeRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/user/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
    }),
  }),
});

export const { useGetUserListQuery, useGetUserQuery, useChangeRoleMutation } =
  userApiSlice;
