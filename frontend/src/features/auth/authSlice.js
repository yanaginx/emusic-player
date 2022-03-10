import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const user_auth = localStorage.getItem("user_auth");

const initialState = {
  user_auth: user_auth ? user_auth : null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const setUserAuth = createAsyncThunk(
  "auth/setUserAuth",
  async (user_auth, thunkAPI) => {
    try {
      return await authService.setUserAuth(user_auth);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const refreshAuthToken = createAsyncThunk(
  "auth/refreshAuthToken",
  async (_, thunkAPI) => {
    try {
      return await authService.refreshAuthToken();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk("/auth/logout", async () => {
  await authService.logout();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.user_auth = action.payload;
    },
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user_auth = action.payload;
      })
      .addCase(setUserAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(refreshAuthToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user_auth = action.payload;
      })
      .addCase(refreshAuthToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user_auth = null;
      });
  },
});

export const { setAccessToken, reset } = authSlice.actions;
export default authSlice.reducer;
