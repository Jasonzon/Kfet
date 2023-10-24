import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";
import { RootState } from "../../store";

export const TotalPaiementsAdapter = createEntityAdapter({
  selectId: (instance: TotalPaiement) => instance.user as string,
  sortComparer: (a: TotalPaiement, b: TotalPaiement) => a.total - b.total,
});

export const initialState = TotalPaiementsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    getTotalPaiements: builder.query({
      query: () => `/paiement/total`,
      transformResponse: (responseData: any) => {
        return TotalPaiementsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result: any, error: any, arg: any) => [
        { type: "TotalPaiement", id: "LIST" },
        ...result.ids.map((id: string) => ({ type: "TotalPaiement", id })),
      ],
    }),
  }),
});

export const { useGetTotalPaiementsQuery } = extendedApiSlice;

export const selectTotalPaiementsResult =
  extendedApiSlice.endpoints.getTotalPaiements.select();

const selectTotalPaiementsData = createSelector(
  selectTotalPaiementsResult,
  (TotalPaiementsResult: any) => TotalPaiementsResult.data
);

export const {
  selectAll: selectAllTotalPaiements,
  selectById: selectTotalPaiementById,
  selectIds: selectTotalPaiementIds,
} = TotalPaiementsAdapter.getSelectors(
  (state: RootState) => selectTotalPaiementsData(state) ?? initialState
);
