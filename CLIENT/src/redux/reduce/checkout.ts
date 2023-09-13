import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    subtotal: 0,
  },
  reducers: {
    addCartItems: (state:any, action) => {
      state.cartItems = [...action.payload];
      return state;
    },
    addSubtotal: (state, action) => {
      state.subtotal = action.payload;
      return state;
    },
  },
});

export const { addCartItems, addSubtotal } = cartSlice.actions;
export default cartSlice.reducer;
