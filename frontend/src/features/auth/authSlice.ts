import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../api/apiSlice";
import { api } from "../api/apiSlice";

import type { RootState } from "../../app/store";

interface AuthState {
  status: "idle" | "loading" | "succeeded" | "failed";
  user: User | null,
  error: string | null;
}

const initialState: AuthState = {
  status: "idle",
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      api.endpoints.registerUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
      }
    );
    builder.addMatcher(
      api.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
      }
    );
  },

});

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
