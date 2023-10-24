import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";
import { RootState } from "../../store";

export const PaiementsAdapter = createEntityAdapter({
  selectId: (instance: Paiement) => instance.id as string,
  sortComparer: (a: Paiement, b: Paiement) => {
    if (!a.validation && !b.validation) {
      return Date.parse(b.envoi) - Date.parse(a.envoi);
    } else if (!a.validation) {
      return -1;
    } else if (!b.validation) {
      return 1;
    } else {
      return Date.parse(b.envoi) - Date.parse(a.envoi);
    }
  },
});

export const initialState = PaiementsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    getPaiements: builder.query({
      query: () => `/paiement`,
      transformResponse: (responseData: any) => {
        return PaiementsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result: any, error: any, arg: any) => [
        { type: "Paiement", id: "LIST" },
        ...result.ids.map((id: string) => ({ type: "Paiement", id })),
      ],
    }),
    addNewPaiement: builder.mutation({
      query: (initialPaiement: Paiement) => ({
        url: "/paiement",
        method: "POST",
        body: {
          ...initialPaiement,
        },
      }),
      invalidatesTags: [{ type: "Paiement", id: "LIST" }],
    }),
    updatePaiement: builder.mutation({
      query: (initialPaiement: Paiement) => ({
        url: `/paiement/${initialPaiement.id}`,
        method: "PUT",
        body: {
          ...initialPaiement,
        },
      }),
      invalidatesTags: (result: any, error: any, arg: any) => [
        { type: "Paiement", id: arg.id },
      ],
    }),
    deletePaiement: builder.mutation({
      query: ({ paiementId }: { paiementId: string }) => ({
        url: `/paiement/${paiementId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result: any, error: any, arg: any) => [
        { type: "Paiement", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetPaiementsQuery,
  useAddNewPaiementMutation,
  useUpdatePaiementMutation,
  useDeletePaiementMutation,
} = extendedApiSlice;

export const selectPaiementsResult =
  extendedApiSlice.endpoints.getPaiements.select();

const selectPaiementsData = createSelector(
  selectPaiementsResult,
  (PaiementsResult: any) => PaiementsResult.data
);

export const {
  selectAll: selectAllPaiements,
  selectById: selectPaiementById,
  selectIds: selectPaiementIds,
} = PaiementsAdapter.getSelectors(
  (state: RootState) => selectPaiementsData(state) ?? initialState
);
