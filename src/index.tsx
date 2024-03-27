import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { environment } from "./Utils/config";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import AppRouter from "./Controllers/Router";
import store from "./Store";

import "./index.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

root.render(
  environment === "DEV" ? (
    <Provider store={store}>
      <Router>
        <AppRouter />
      </Router>
    </Provider>
  ) : (
    <StrictMode>
      <Provider store={store}>
        <Router>
          <AppRouter />
        </Router>
      </Provider>
    </StrictMode>
  )
);
