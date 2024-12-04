import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store.ts";

const productSlice = createSlice({
  name: "product",
  initialState: {
    productList: [],
  },
  reducers: {
    setProductList: (state, action) => {
      state.productList = action.payload;
    },
    clearSaleList: (state) => {
      state.productList = [];
    },
  },
});

export const { setProductList, clearSaleList } = productSlice.actions;

export default productSlice.reducer;

export const selectProductList = (state: RootState) =>
  state.product.productList;
