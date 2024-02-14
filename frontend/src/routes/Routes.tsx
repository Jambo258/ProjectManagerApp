import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import { useAppSelector } from "../app/hooks.ts";
import { PublicPage } from "../features/frontpage/PublicPage.tsx";
import { RegisterView } from "../features/auth/RegisterView.tsx";
import { LoginView } from "../features/auth/LoginView.tsx";
import { ProjectView } from "../features/project/ProjectView.tsx";
import { PrivatePage } from "../features/user/PrivatePage.tsx";
import { HomeView } from "../features/frontpage/HomeView.tsx";
import { Page } from "../features/page/Page.tsx";
import { ProjectTemplate } from "../features/project/ProjectTemplate.tsx";

export const AppRouter = () => {
  const user = useAppSelector((state) => state.auth.user);

  const router = createBrowserRouter(
    user === null ?
      createRoutesFromElements(
        <Route path="/" element={<PublicPage />}>
          <Route index element={<HomeView />} />
          <Route path="login" element={<LoginView />} />
          <Route path="register" element={<RegisterView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )
      :
      createRoutesFromElements(
        <Route path="/" element={<PrivatePage />}>
          <Route index element={<ProjectView />} />
          <Route path="projects/:projectId/:pageId" element={<Page />} />
          <Route path="projects/:projectId" element={<ProjectTemplate />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )
  );
  return <RouterProvider router={router} />;
};
