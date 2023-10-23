import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../../utils/token";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://super-deer-gloves.cyclic.app",
  prepareHeaders: async (headers: any) => {
    const token = await getToken();
    if (token) {
      headers.set("token", token);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

export const apiSlice: any = createApi({
  baseQuery,
  tagTypes: [
    "User",
    "Article",
    "Presence",
    "Paiement",
    "TotalPaiement",
    "AuthUser",
  ],
  endpoints: (builder) => ({}),
});
