import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";
import { RootState } from "../../store";

export const UsersAdapter = createEntityAdapter({
  selectId: (instance: User) => instance.id as string,
  sortComparer: false,
});

export const initialState = UsersAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    getUsers: builder.query({
      query: () => `/user`,
      transformResponse: (responseData: any) => {
        return UsersAdapter.setAll(initialState, responseData);
      },
      providesTags: (result: any, error: any, arg: any) => [
        { type: "User", id: "LIST" },
        ...result.ids.map((id: string) => ({ type: "User", id })),
      ],
    }),
    updateUser: builder.mutation({
      query: (initialUser: User) => ({
        url: `/user/${initialUser.id}`,
        method: "PUT",
        body: {
          ...initialUser,
        },
      }),
      invalidatesTags: (result: any, error: any, arg: any) => [
        { type: "User", id: arg.id },
      ],
    }),
  }),
});

export const { useGetUsersQuery, useUpdateUserMutation } = extendedApiSlice;

export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select();

const selectUsersData = createSelector(
  selectUsersResult,
  (UsersResult: any) => UsersResult.data
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = UsersAdapter.getSelectors(
  (state: RootState) => selectUsersData(state) ?? initialState
);
