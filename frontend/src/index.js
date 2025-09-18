import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "./components/GlobalStyles";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import AccessibilityStyles from "./styles/AccessibilityStyles";
import AccessibilityMenu from "./components/AccessibilityMenu";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <NotificationProvider>
        <AccessibilityProvider>
          <CssBaseline />
          <GlobalStyles />
          <AccessibilityStyles />
          <App />
          <AccessibilityMenu />
        </AccessibilityProvider>
      </NotificationProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
