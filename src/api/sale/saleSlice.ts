import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.ts";

const saleSlice = createSlice({
  name: "sale",
  initialState: {
    saleList: [],
    sale: {},
    recordList: [],
  },
  reducers: {
    setSaleList: (state, action) => {
      state.saleList = action.payload;
    },

    setSale: (state, action) => {
      state.sale = action.payload;
    },

    setRecordList: (state, action) => {
      state.recordList = action.payload;
    },

    clearSaleList: (state) => {
      state.saleList = [];
      state.sale = {};
      state.recordList = [];
    },
  },
});

export const { setSaleList, setSale, setRecordList, clearSaleList } =
  saleSlice.actions;

export default saleSlice.reducer;

export const selectsaleList = (state: RootState) => state.sale.saleList;
export const selectsale = (state: RootState) => state.sale.sale;
export const selectRecordList = (state: RootState) => state.sale.recordList;
