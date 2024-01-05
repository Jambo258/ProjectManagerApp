import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from "react-router-dom";
import App from "../app/App.tsx";
import { HomeView } from "../pages/views/homeView.tsx";
import { PublicPage } from "../pages/publicPage.tsx";
import { RegisterView } from "../pages/views/registerView.tsx";
import { LoginView } from "../pages/views/loginView.tsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<PublicPage />} >
        <Route index element={<HomeView/>} />
        <Route path="login" element={<LoginView />} />
        <Route path="register" element={<RegisterView />} />
      </Route>
    </Route>
  )
);
