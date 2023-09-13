import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "sort_by_category",
  initialState: "",
  reducers: {
    sortByCategory: (state, action) => {
      return (state = action.payload);
    },
  },
});

const { reducer } = productSlice;
export const { sortByCategory } = productSlice.actions;
export default reducer;
