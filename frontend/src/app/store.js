import { configureStore } from "@reduxjs/toolkit";
import ferReducer from "../features/fer/ferSlice";
import authReducer from "../features/auth/authSlice";
import trackReducer from "../features/track/trackSlice";

export const store = configureStore({
  reducer: {
    fer: ferReducer,
    auth: authReducer,
    track: trackReducer,
  },
});
