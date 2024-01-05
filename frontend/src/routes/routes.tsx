import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../app/App.tsx";
import { HomeView } from "../pages/views/homeView.tsx";
import { PublicPage } from "../pages/publicPage.tsx";
import { RegisterView } from "../pages/views/registerView.tsx";
import { TestView } from "../pages/views/testView.tsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<PublicPage />}>
        <Route index element={<HomeView />} />
        <Route
          path="login"
          element={<p className="text-dark-font text-2xl">Login</p>}
        />
        <Route path="register" element={<RegisterView />} />
        <Route path="test" element={<TestView />} />
      </Route>
    </Route>
  )
);
