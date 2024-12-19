import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.ts";
import { UserType } from "@/types/UserType.ts";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {} as UserType,
    token: "",
  },

  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user = user;
      state.token = accessToken;
    },

    signOut: (state) => {
      state.user = {} as UserType;
      state.token = "";
    },
  },
});

export const { setCredentials, signOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;

export const selectCurrentToken = (state: RootState) => state.auth.token;
