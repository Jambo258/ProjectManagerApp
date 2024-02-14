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
  reducers: {
    logout: state => { state.user = null; },
  },
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
    builder.addMatcher(
      api.endpoints.updateUser.matchFulfilled,
      (state, { payload }) => {
        if (state.user) {
          state.user.name = payload.name;
          state.user.email = payload.email;
        }
      }
    );
    builder.addMatcher(
      api.endpoints.logout.matchFulfilled,
      (state) => {
        state.user = null;
      }
    );
    builder.addMatcher(
      api.endpoints.deleteUser.matchFulfilled,
      (state) => {
        state.user = null;
      }
    );
  },

});

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
