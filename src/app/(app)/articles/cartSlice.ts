import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";

interface CartState {
  cart: Article[];
}

const initialState: CartState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state: CartState,
      action: PayloadAction<{ article: Article }>
    ) => {
      const { article } = action.payload;
      state.cart.push(article);
    },
    removeFromCart: (
      state: CartState,
      action: PayloadAction<{ articleId: string }>
    ) => {
      const { articleId } = action.payload;
      const index = state.cart.findIndex(
        (article: Article) => article.id === articleId
      );
      if (index !== -1) {
        state.cart.splice(index, 1);
      }
    },
    removeCart: (state: CartState, _) => {
      state.cart = [];
    },
  },
});

export const { addToCart, removeFromCart, removeCart } = cartSlice.actions;

export default cartSlice.reducer;

export const selectCart = (state: RootState) => state.cart.cart;
