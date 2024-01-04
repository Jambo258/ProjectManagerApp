import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from "react-router-dom";
import App from "../app/App.tsx";
import { HomeView } from "../pages/views/HomeView.tsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<HomeView />} />
      <Route path="login" element={<p className="text-dark-font text-2xl">Login</p>} />
      <Route path="register" element={<p className="text-dark-font text-2xl">Register</p>} />
    </Route>
  )
);

