import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.ts";
import { BusinessType } from "@/types/BusinessType.ts";

const businessSlice = createSlice({
  name: "business",
  initialState: {
    business: {} as BusinessType,
  },

  reducers: {
    setBusiness: (state, action) => {
      state.business = action.payload;
    },

    clearBusinessList: (state) => {
      state.business = {} as BusinessType;
    },
  },
});

export const { setBusiness, clearBusinessList } = businessSlice.actions;

export default businessSlice.reducer;

export const selectBusiness = (state: RootState) => state.business.business;
