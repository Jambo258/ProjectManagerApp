import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from "react-router-dom";
import App from "../App.tsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="login" element={<p className="text-dark-font text-2xl">Login</p>} />
      <Route path="register" element={<p className="text-dark-font text-2xl">Register</p>} />
    </Route>
  )
);

