import React from "react";
import { AppRouter } from "./routes/routes.tsx";
import ReactDOM from "react-dom/client";
import { persistor, store } from "./app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRouter/>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
