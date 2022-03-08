import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const user_auth = JSON.parse(localStorage.getItem("user_auth"));

const initialState = {
  user_auth: user_auth ? user_auth : null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

export const getUserAuth = createAsyncThunk(
  "auth/getUserAuth",
  async (_, thunkAPI) => {
    try {
      return await authService.getUserAuth();
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
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user_auth = action.payload;
      })
      .addCase(getUserAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user_auth = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
