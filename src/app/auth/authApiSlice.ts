import { apiSlice } from "../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    login: builder.mutation({
      query: (credentials: { user: User; token: string }) => ({
        url: "/user/connect",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    auth: builder.query({
      query: () => "/user/auth",
    }),
    getUrl: builder.query({
      query: () => "/user/url",
    }),
    getAccessToken: builder.mutation({
      query: (code: string) => ({
        url: "/user/dataverse",
        method: "POST",
        body: { code },
      }),
    }),
    log: builder.mutation({
      query: (accessToken: string) => ({
        url: "/user/login",
        method: "POST",
        body: { accessToken },
      }),
    }),
    addNewUser: builder.mutation({
      query: (registeringUser: Registering) => ({
        url: "/user",
        method: "POST",
        body: { ...registeringUser },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useAuthQuery,
  useGetUrlQuery,
  useGetAccessTokenMutation,
  useLogMutation,
  useAddNewUserMutation,
} = authApiSlice;
