import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

interface ArticleFormState {
  article: Article;
}

const initialState: ArticleFormState = {
  article: {
    id: undefined,
    prix: 0,
    nom: "",
    image: "",
  },
};

const articleFormSlice = createSlice({
  name: "articleForm",
  initialState,
  reducers: {
    updatePrix: (
      state: ArticleFormState,
      action: PayloadAction<{ prix: number }>
    ) => {
      const { prix } = action.payload;
      if (prix) {
        state.article.prix = prix;
      }
    },
    updateImage: (
      state: ArticleFormState,
      action: PayloadAction<{ image: string }>
    ) => {
      const { image } = action.payload;
      if (image) {
        state.article.image = image;
      }
    },
    updateNom: (
      state: ArticleFormState,
      action: PayloadAction<{ nom: string }>
    ) => {
      const { nom } = action.payload;
      if (nom) {
        state.article.nom = nom;
      }
    },
    updateId: (
      state: ArticleFormState,
      action: PayloadAction<{ id: string }>
    ) => {
      const { id } = action.payload;
      if (id) {
        state.article.id = id;
      }
    },
    removeArticle: (state: ArticleFormState, _) => {
      state.article = {
        id: undefined,
        prix: 0,
        nom: "",
        image: "",
      };
    },
    setArticle: (
      state: ArticleFormState,
      action: PayloadAction<{ article: Article }>
    ) => {
      const { article } = action.payload;
      if (article) {
        state.article = article;
      }
    },
  },
});

export const { updateImage, updateNom, updatePrix, removeArticle, setArticle } =
  articleFormSlice.actions;

export default articleFormSlice.reducer;

export const selectArticle = (state: RootState) => state.articleForm.article;
