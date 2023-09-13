import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "sort",
  initialState: "",
  reducers: {
    sortByProduct: (state, action) => {
      return (state = action.payload);
    },
  },
});

const { reducer } = productSlice;
export const { sortByProduct } = productSlice.actions;
export default reducer;
