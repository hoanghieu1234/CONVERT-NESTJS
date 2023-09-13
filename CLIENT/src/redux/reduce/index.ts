import userReducer from "./userSlice";
import updateReducer from "./updateSlice";
import checkoutReducer from "./checkout";
import sortReducer from "./sorfByProduct";
import sortByCategoryReducer from "./sortByCategory";
const rootReducer = {
  user: userReducer,
  update: updateReducer,
  checkout: checkoutReducer,
  sortBy: sortReducer,
  sortByCategory: sortByCategoryReducer
};

export default rootReducer;
