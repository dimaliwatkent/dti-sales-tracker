import { apiSlice } from "../apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (credentials) => ({
        url: "/auth/signin/",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    signup: builder.mutation({
      query: (credentials) => ({
        url: "/auth/signup/",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    signout: builder.mutation({
      query: (id) => ({
        url: "/auth/signout",
        method: "POST",
        body: { id: id },
      }),
    }),
  }),
});

export const {
  useSigninMutation,

  useSignoutMutation,

  useSignupMutation,
} = authApiSlice;
