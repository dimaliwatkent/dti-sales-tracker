import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "665bd420072d6843ad4d49b7",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const { setUserId } = globalSlice.actions;
export default globalSlice.reducer;
