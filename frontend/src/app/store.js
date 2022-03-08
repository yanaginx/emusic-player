import { configureStore } from "@reduxjs/toolkit";
import ferReducer from "../features/fer/ferSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    fer: ferReducer,
    auth: authReducer,
  },
});
