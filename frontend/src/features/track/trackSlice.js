import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tracks: [],
};

export const trackSlice = createSlice({
  name: "track",
  initialState,
  reducers: {
    setTrackList: (state, action) => {
      state.tracks = action.payload;
    },
    reset: (state) => initialState,
  },
});

export const { setTrackList, reset } = trackSlice.actions;
export default trackSlice.reducer;
