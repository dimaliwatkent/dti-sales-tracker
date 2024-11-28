import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.ts";
import { Business, BusinessWithViolation } from "@/types/BusinessType.ts";

const businessSlice = createSlice({
  name: "business",
  initialState: {
    businessList: [] as Business[],
    business: {} as Business,
    activeBusiness: {} as Business,
    monitorBusiness: {} as BusinessWithViolation,
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

    setMonitorBusiness: (state, action) => {
      state.monitorBusiness = action.payload;
    },

    clearBusinessList: (state) => {
      state.businessList = [];
      state.business = {} as Business;
      state.activeBusiness = {} as Business;
      state.monitorBusiness = {} as BusinessWithViolation;
    },
  },
});

export const {
  setBusinessList,
  setBusiness,
  setActiveBusiness,
  setMonitorBusiness,
  clearBusinessList,
} = businessSlice.actions;

export default businessSlice.reducer;

export const selectBusinessList = (state: RootState) =>
  state.business.businessList;
export const selectBusiness = (state: RootState) => state.business.business;
export const selectActiveBusiness = (state: RootState) =>
  state.business.activeBusiness;
export const selectMonitorBusiness = (state: RootState) =>
  state.business.monitorBusiness;
