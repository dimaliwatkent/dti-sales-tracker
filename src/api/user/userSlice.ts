import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.ts";
import { UserType } from "@/types/UserType.ts";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {} as UserType,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    clearUserList: (state) => {
      state.user = {} as UserType;
    },
  },
});

export const {  setUser, clearUserList } =
  userSlice.actions;

export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user.user;
