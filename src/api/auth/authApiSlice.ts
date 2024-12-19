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

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),

    resetPassword: builder.mutation({
      query: (props) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { ...props },
      }),
    }),
  }),
});

export const {
  useSigninMutation,
  useSignoutMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApiSlice;
