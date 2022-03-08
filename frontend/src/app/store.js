import { configureStore } from "@reduxjs/toolkit";
import ferReducer from "../features/fer/ferSlice";

export const store = configureStore({
  reducer: {
    fer: ferReducer,
  },
});
