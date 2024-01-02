import React from "react";
import { router } from "./routes/routes.tsx";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!)
  .render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );