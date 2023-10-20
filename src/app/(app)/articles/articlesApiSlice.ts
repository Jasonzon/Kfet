import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";
import { RootState } from "../../store";

export const ArticlesAdapter = createEntityAdapter({
  selectId: (instance: Article) => instance.id as string,
  sortComparer: false,
});

export const initialState = ArticlesAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    getArticles: builder.query({
      query: () => `/article`,
      transformResponse: (responseData: any) => {
        return ArticlesAdapter.setAll(initialState, responseData);
      },
      providesTags: (result: any, error: any, arg: any) => [
        { type: "Article", id: "LIST" },
        ...result.ids.map((id: string) => ({ type: "Article", id })),
      ],
    }),
    addNewArticle: builder.mutation({
      query: (initialArticle: Article) => ({
        url: "/article",
        method: "POST",
        body: {
          ...initialArticle,
        },
      }),
      invalidatesTags: [{ type: "Article", id: "LIST" }],
    }),
    updateArticle: builder.mutation({
      query: (initialArticle: Article) => ({
        url: `/article/${initialArticle.id}`,
        method: "PUT",
        body: {
          ...initialArticle,
        },
      }),
      invalidatesTags: (result: any, error: any, arg: any) => [
        { type: "Article", id: arg.id },
      ],
    }),
    deleteArticle: builder.mutation({
      query: ({ articleId }: { articleId: string }) => ({
        url: `/article/${articleId}`,
        method: "DELETE",
        body: { articleId },
      }),
      invalidatesTags: (result: any, error: any, arg: any) => [
        { type: "Article", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useAddNewArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
} = extendedApiSlice;

export const selectArticlesResult =
  extendedApiSlice.endpoints.getArticles.select();

const selectArticlesData = createSelector(
  selectArticlesResult,
  (ArticlesResult: any) => ArticlesResult.data
);

export const {
  selectAll: selectAllArticles,
  selectById: selectArticleById,
  selectIds: selectArticleIds,
} = ArticlesAdapter.getSelectors(
  (state: RootState) => selectArticlesData(state) ?? initialState
);
