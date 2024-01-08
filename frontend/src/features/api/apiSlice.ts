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

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  password?: string;
}

export interface Project {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectEditRequest {
  id: number;
  name: string;
}

export interface ProjectWithPages extends Project {
  members: User[];
  pages: Page[];
}

export interface Page {
  id: number;
  name: string;
  content: JSON;
  projectid: number;
  created_at: string;
  updated_at: string;
}

export interface PageRequest {
  name: string;
  content: JSON;
  projectid: number;
}

export interface PageEditRequest {
  id: number;
  name?: string;
  content?: JSON;
}

export interface ProjectAndUser {
  userId: number;
  projectId: number;
  role: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/",
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
    }),
    loginUser: builder.mutation<User, LoginRequest>({
      query: user => ({
        url: "/users/login",
        method: "POST",
        body: user,
      }),
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
      })
    }),
    deleteUser: builder.mutation<User, void>({
      query: () => ({
        url: "/users/delete",
        method: "DELETE",
      })
    }),
    getProjects: builder.query<Project[], void>({
      query: () => "/projects",
      providesTags: ["Projects"],
    }),
    getProject: builder.query<ProjectWithPages, number>({
      query: (projectId) => `/projects/${projectId}`,
      providesTags: (_result, _error, projectId) => [{ type: "Pages", id: projectId }],
    }),
    addNewProject: builder.mutation<Project, string>({
      query: (projectName) => ({
        url: "/projects",
        method: "POST",
        body: { name: projectName },
      }),
      invalidatesTags: ["Projects"],
    }),
    editProject: builder.mutation<Project, ProjectEditRequest>({
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
    addNewPage: builder.mutation<Page, string>({
      query: (pageName) => ({
        url: "/pages",
        method: "POST",
        body: { name: pageName },
      }),
      invalidatesTags: ["Pages"],
    }),
    editPage: builder.mutation<Page, PageEditRequest>({
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
    addNewProjectUser: builder.mutation<Page, ProjectAndUser>({
      query: (projectAndUser) => ({
        url: `/projects/${projectAndUser.projectId}/users/${projectAndUser.userId}`,
        method: "POST",
        body: { role: projectAndUser.role },
      }),
      invalidatesTags: (_result, _error, projectAndUser) => [{ type: "Projects", id: projectAndUser.projectId }],
    }),
    editProjectUser: builder.mutation<Page, ProjectAndUser>({
      query: (projectAndUser) => ({
        url: `/projects/${projectAndUser.projectId}/users/${projectAndUser.userId}`,
        method: "PUT",
        body: { role: projectAndUser.role },
      }),
      invalidatesTags: (_result, _error, projectAndUser) => [{ type: "Projects", id: projectAndUser.projectId }],
    }),
    deleteProjectUser: builder.mutation<Page, ProjectAndUser>({
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
