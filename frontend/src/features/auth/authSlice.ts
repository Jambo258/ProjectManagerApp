import { createSlice } from "@reduxjs/toolkit";
// import type { RootState } from "../../app/store";

interface AuthState {
  status: "idle" | "loading" | "succeeded" | "failed";
  userInfo: object, // This needs to be changed at a later date
  error: null | string;
}

const initialState: AuthState = {
  status: "idle",
  userInfo: {},
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {}
});

export default authSlice.reducer;