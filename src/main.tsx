import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Service worker registration disabled to prevent stale cached bundles from interfering with auth.
// (This app is a protected research prototype; reliability here prioritizes session stability.)

createRoot(document.getElementById("root")!).render(
  <App />
);
