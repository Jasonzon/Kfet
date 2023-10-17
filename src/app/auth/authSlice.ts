import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { setToken } from "../../utils/token";

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state: AuthState,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      if (token) {
        setToken(token);
      }
      if (user) {
        state.user = user;
      }
    },
    setUser: (state: AuthState, action: PayloadAction<{ user: User }>) => {
      const { user } = action.payload;
      if (user) {
        state.user = user;
      }
    },
    logOut: (state: AuthState, action: PayloadAction) => {
      state.user = null;
    },
  },
});

export const { setCredentials, logOut, setUser } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
