import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import { PublicPage } from "../features/frontpage/PublicPage.tsx";
import { RegisterView } from "../features/auth/RegisterView.tsx";
import { LoginView } from "../features/auth/LoginView.tsx";
import { ProfileModal } from "../features/user/ProfileModal.tsx";
import { ProjectView } from "../features/project/ProjectView.tsx";
import { PrivatePage } from "../features/user/PrivatePage.tsx";
import { HomeView } from "../features/frontpage/HomeView.tsx";
import { Page } from "../features/page/Page.tsx";
import { useAppSelector } from "../app/hooks.ts";
import { ProjectTemplate } from "../features/project/ProjectTemplate.tsx";

export const AppRouter = () => {
  const user = useAppSelector((state) => state.auth.user);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={user ? <PrivatePage /> : <PublicPage />}>
        <Route index element={user ? <ProjectView /> : <HomeView />} />
        <Route path="login" element={<LoginView />} />
        {user && (
          <>
            <Route path="projects/:projectId/:pageId" element={<Page />} />
            <Route path="projects/:projectId" element={<ProjectTemplate />} />
            <Route path="profile" element={<ProfileModal />} />
          </>
        )}
        <Route path="register" element={<RegisterView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};
