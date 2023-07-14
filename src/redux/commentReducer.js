import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: []
  },
  reducers: {
    SAVE_COMMENTS(state, action) {
      return {
        ...state,
        comments: action.payload
      };
    }
  }
});

export const { SAVE_COMMENTS } = commentSlice.actions;
export default commentSlice.reducer;
