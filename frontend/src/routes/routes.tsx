import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "../app/App.tsx";
import { PublicPage } from "../pages/publicPage.tsx";
import { RegisterView } from "../pages/views/registerView.tsx";
import { LoginView } from "../pages/views/loginView.tsx";
import { ProfileModal } from "../pages/components/profilemodal.tsx";
import { ProjectView } from "../pages/views/projectView.tsx";
import { PrivatePage } from "../pages/privatePage.tsx";
import { HomeView } from "../pages/views/homeView.tsx";
import Editor from "../features/editor/Editor.tsx";
import { useAppSelector } from "../app/hooks.ts";

export const AppRouter = () => {
  const user = useAppSelector((state) => state.auth.user);
  console.log(user);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path="/" element={user ? <PrivatePage /> : <PublicPage />}>
          <Route index element={user ? <ProjectView /> : <HomeView />} />
          <Route path="login" element={<LoginView />} />
          {user && (
            <>
              <Route path="pages/:pageId" element={<Editor />} />
              <Route path="profile" element={<ProfileModal />} />
            </>
          )}
          <Route path="register" element={<RegisterView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};
