import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";
import { RootState } from "../../store";

export const PresencesAdapter = createEntityAdapter({
  selectId: (instance: Presence) => instance.id as string,
  sortComparer: false,
});

export const initialState = PresencesAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    getPresences: builder.query({
      query: () => `/presence`,
      transformResponse: (responseData: any) => {
        return PresencesAdapter.setAll(initialState, responseData);
      },
      providesTags: (result: any, error: any, arg: any) => [
        { type: "Presence", id: "LIST" },
        ...result.ids.map((id: string) => ({ type: "Presence", id })),
      ],
    }),
    addNewPresence: builder.mutation({
      query: (initialPresence: Presence) => ({
        url: "/presence",
        method: "POST",
        body: {
          ...initialPresence,
        },
      }),
      invalidatesTags: [{ type: "Presence", id: "LIST" }],
    }),
    updatePresence: builder.mutation({
      query: (initialPresence: Presence) => ({
        url: `/presence/${initialPresence.id}`,
        method: "PUT",
        body: {
          ...initialPresence,
        },
      }),
      invalidatesTags: (result: any, error: any, arg: any) => [
        { type: "Presence", id: arg.id },
      ],
    }),
    deletePresence: builder.mutation({
      query: ({ presenceId }: { presenceId: string }) => ({
        url: `/presence/${presenceId}`,
        method: "DELETE",
        body: { presenceId },
      }),
      invalidatesTags: (result: any, error: any, arg: any) => [
        { type: "Presence", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetPresencesQuery,
  useAddNewPresenceMutation,
  useUpdatePresenceMutation,
  useDeletePresenceMutation,
} = extendedApiSlice;

export const selectPresencesResult =
  extendedApiSlice.endpoints.getPresences.select();

const selectPresencesData = createSelector(
  selectPresencesResult,
  (PresencesResult: any) => PresencesResult.data
);

export const {
  selectAll: selectAllPresences,
  selectById: selectPresenceById,
  selectIds: selectPresenceIds,
} = PresencesAdapter.getSelectors(
  (state: RootState) => selectPresencesData(state) ?? initialState
);
