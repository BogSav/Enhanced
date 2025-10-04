// ---------------------------------------------------------------------------
// Application Entry Point – React Root Initialization
// ---------------------------------------------------------------------------
// Purpose:
//   Bootstrap the React application by mounting the root component tree
//   to the DOM and setting up essential providers and global configuration.
//
// Key responsibilities:
//   1. Create React root using the modern createRoot API (React 18+).
//   2. Wrap the app with BrowserRouter for client-side routing.
//   3. Enable React.StrictMode for development warnings and future compatibility.
//   4. Import global styles and i18n initialization as side effects.
//
// Entry flow:
//   index.html → <script src="/src/main.tsx"> → this file → App component tree
//
// Notes:
//   - The i18n import triggers i18next initialization before any components render.
//   - StrictMode intentionally double-invokes effects/renders in dev to catch bugs.
//   - Root element error handling prevents silent failures if DOM structure changes.
//   - BrowserRouter assumes the app is served from domain root; use HashRouter
//     or basename prop if deploying to a subdirectory.
// ---------------------------------------------------------------------------

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import "./i18n";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
