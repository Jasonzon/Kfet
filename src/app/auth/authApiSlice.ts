import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    auth: builder.query({
      query: () => "/user/auth",
    }),
    login: builder.mutation({
      query: ({ mail, password }: { mail: string; password: string }) => ({
        url: "/user/connect",
        method: "POST",
        body: { mail, password },
      }),
    }),
    addNewUser: builder.mutation({
      query: (user: User) => ({
        url: "/user",
        method: "POST",
        body: { ...user },
      }),
    }),
  }),
});

export const { useLoginMutation, useAuthQuery, useAddNewUserMutation } =
  authApiSlice;
