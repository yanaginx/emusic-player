import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ferService from "./ferService";

const initialState = {
  emotions: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: "",
};

// Get emotions from server
export const getEmotions = createAsyncThunk(
  "fer/getEmotions",
  async (_, thunkAPI) => {
    try {
      return await ferService.getEmotions();
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

export const ferSlice = createSlice({
  name: "fer",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmotions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEmotions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.emotions = action.payload;
      })
      .addCase(getEmotions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = ferSlice.actions;
export default ferSlice.reducer;
