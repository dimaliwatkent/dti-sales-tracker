import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.ts";
import { User } from "@/types/UserType.ts";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userList: [] as User[],
    user: {} as User,
    activeUser: {} as User,
  },
  reducers: {
    setUserList: (state, action) => {
      state.userList = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },
    setActiveUser: (state, action) => {
      state.activeUser = action.payload;
    },

    clearUserList: (state) => {
      state.userList = [] as User[];
      state.user = {} as User;
      state.activeUser = {} as User;
    },
  },
});

export const { setUserList, setUser, setActiveUser, clearUserList } =
  userSlice.actions;

export default userSlice.reducer;

export const selectUserList = (state: RootState) => state.user.userList;
export const selectUser = (state: RootState) => state.user.user;
export const selectActiveBusiness = (state: RootState) => state.user.activeUser;
