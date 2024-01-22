import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Role = "viewer" | "manager" | "editor";

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

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  password?: string;
}

export interface Member {
  id: number;
  role: Role;
  name: string;
  email: string;
}

export interface Project {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  pages: Page[];
  users: Member[];
}

export interface EditProjectRequest {
  id: number;
  name: string;
}

export interface Page {
  id: number;
  name: string;
  content: Uint8Array | null;
  projectid: number;
  created_at: string;
  updated_at: string;
}

export interface AddPageRequest {
  name: string;
  projectid: number;
}

export interface EditPageRequest {
  id: number;
  name: string;
}

export interface AddMemberReqeust {
  projectId: number;
  email: string;
  role: Role;
}

export interface ProjectAndUser {
  userId: number;
  projectId: number;
  role: Role;
}

export interface NewPage {
  pageName: string;
  projectid: number;
}

export interface ProjectUser {
  userid: number;
  projectid: number;
  updated_at: Date;
  created_at: Date;
  role: Role;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL as string,
    credentials: "include",
  }),
  tagTypes: ["Projects", "Pages",],
  endpoints: builder => ({
    registerUser: builder.mutation<User, RegisterRequest>({
      query: newUser => ({
        url: "/users/register",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Projects", "Pages"],
    }),
    loginUser: builder.mutation<User, LoginRequest>({
      query: user => ({
        url: "/users/login",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Projects", "Pages"],
    }),
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: user => ({
        url: "/users/update",
        method: "PUT",
        body: user,
      }),
    }),
    logout: builder.mutation<User, void>({
      query: () => ({
        url: "/users/logout",
        method: "GET",
      }),
      invalidatesTags: ["Projects", "Pages"],
    }),
    deleteUser: builder.mutation<User, void>({
      query: () => ({
        url: "/users/delete",
        method: "DELETE",
      }),
      invalidatesTags: ["Projects", "Pages"],
    }),
    getUserByEmail: builder.mutation<{ id: number; }, void>({
      query: () => ({
        url: "/users/getuserbyemail",
        method: "POST",
      }),
    }),
    getProjects: builder.query<Project[], void>({
      query: () => "/projects",
      providesTags: (result = []) => [
        { type: "Projects", id: "LIST" },
        ...result.map(({ id }) => ({ type: "Projects" as const, id }))
      ]
    }),
    getProject: builder.query<Project, number>({
      query: (projectId) => `/projects/${projectId}`,
      providesTags: (_result, _error, projectId) => [{ type: "Projects", id: projectId }],
    }),
    addNewProject: builder.mutation<Project, string>({
      query: (projectName) => ({
        url: "/projects",
        method: "POST",
        body: { name: projectName },
      }),
      invalidatesTags: [{ type: "Projects", id: "LIST" }],
    }),
    editProject: builder.mutation<Project, EditProjectRequest>({
      query: ({ id, name }) => ({
        url: `/projects/${id}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: (_result, _error, project) => [{ type: "Projects", id: project.id }],
    }),
    deleteProject: builder.mutation<Project, number>({
      query: (projectId) => ({
        url: `/projects/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, projectId) => [{ type: "Projects", id: projectId }],
    }),
    getProjectPage: builder.query<Page, number>({
      query: (pageId) => `/pages/${pageId}`,
      providesTags: (_result, _error, pageId) => [{ type: "Pages", id: pageId }],
    }),
    addNewPage: builder.mutation<Page, NewPage>({
      query: ({ pageName, projectid }) => ({
        url: "/pages",
        method: "POST",
        body: { name: pageName, projectid: projectid },
      }),
      invalidatesTags: (_result, _error, page) => [{ type: "Projects", id: page.projectid }],
    }),
    editPage: builder.mutation<Page, EditPageRequest>({
      query: ({ id, ...body }) => ({
        url: `/pages/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: (_result, _error, page) => [{ type: "Pages", id: page.id }],
    }),
    deletePage: builder.mutation<Page, number>({
      query: (pageId) => ({
        url: `/pages/${pageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, pageId) => [{ type: "Pages", id: pageId }],
    }),
    addNewProjectUser: builder.mutation<ProjectUser, AddMemberReqeust>({
      query: (addMemberReqeust) => ({
        url: `/projects/${addMemberReqeust.projectId}/users/`,
        method: "POST",
        body: { role: addMemberReqeust.role, email: addMemberReqeust.email },
      }),
      invalidatesTags: (_result, _error, projectAndUser) => [{ type: "Projects", id: projectAndUser.projectId }],
    }),
    editProjectUser: builder.mutation<ProjectUser, ProjectAndUser>({
      query: (projectAndUser) => ({
        url: `/projects/${projectAndUser.projectId}/users/${projectAndUser.userId}`,
        method: "PUT",
        body: { role: projectAndUser.role },
      }),
      invalidatesTags: (_result, _error, projectAndUser) => [{ type: "Projects", id: projectAndUser.projectId }],
    }),
    deleteProjectUser: builder.mutation<ProjectUser, ProjectAndUser>({
      query: (projectAndUser) => ({
        url: `/projects/${projectAndUser.projectId}/users/${projectAndUser.userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, projectAndUser) => [{ type: "Projects", id: projectAndUser.projectId }],
    }),
  })
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetProjectsQuery,
  useGetProjectQuery,
  useAddNewProjectMutation,
  useEditProjectMutation,
  useDeleteProjectMutation,
  useGetProjectPageQuery,
  useAddNewPageMutation,
  useEditPageMutation,
  useDeletePageMutation,
  useAddNewProjectUserMutation,
  useEditProjectUserMutation,
  useDeleteProjectUserMutation,
} = api;
