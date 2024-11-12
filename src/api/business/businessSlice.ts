import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.ts";
import { Business } from "@/types/BusinessType.ts";

const businessSlice = createSlice({
  name: "business",
  initialState: {
    businessList: [] as Business[],
    business: {} as Business,
    activeBusiness: {} as Business,
  },

  reducers: {
    setBusinessList: (state, action) => {
      state.businessList = action.payload;
    },

    setBusiness: (state, action) => {
      state.business = action.payload;
    },

    setActiveBusiness: (state, action) => {
      state.activeBusiness = action.payload;
    },

    clearBusinessList: (state) => {
      state.businessList = [];
      state.business = {} as Business;
      state.activeBusiness = {} as Business;
    },
  },
});

export const {
  setBusinessList,
  setBusiness,
  setActiveBusiness,
  clearBusinessList,
} = businessSlice.actions;

export default businessSlice.reducer;

export const selectBusinessList = (state: RootState) =>
  state.business.businessList;
export const selectBusiness = (state: RootState) => state.business.business;
export const selectActiveBusiness = (state: RootState) =>
  state.business.activeBusiness;
