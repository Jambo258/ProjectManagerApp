import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}


export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/",
    credentials: "include",
  }),
  endpoints: builder => ({
    registerUser: builder.mutation<User, RegisterRequest>({
      query: newUser => ({
        url: "/users/register",
        method: "POST",
        body: newUser
      })
    }),
    loginUser: builder.mutation<User, LoginRequest>({
      query: user => ({
        url: "/users/login",
        method: "POST",
        body: user
      })
    }),
  })
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
} = api;
