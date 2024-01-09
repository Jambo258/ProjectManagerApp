import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from "react-router-dom";
import App from "../app/App.tsx";
import { PublicPage } from "../pages/publicPage.tsx";
import { RegisterView } from "../pages/views/registerView.tsx";
import { LoginView } from "../pages/views/loginView.tsx";
import { ProfileModal } from "../pages/components/profilemodal.tsx";
import { ProjectView } from "../pages/views/projectView.tsx";
import { PrivatePage } from "../pages/privatePage.tsx";
import { HomeView } from "../pages/views/homeView.tsx";

const loggedIn = true;

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={loggedIn ? <PrivatePage /> : <PublicPage />} >
        <Route index element={loggedIn ? <ProjectView /> : <HomeView />} />
        <Route path="login" element={<LoginView />} />
        <Route path="profile" element={<ProfileModal/>} />
        <Route path="register" element={<RegisterView />} />
      </Route>
    </Route>
  )
);
