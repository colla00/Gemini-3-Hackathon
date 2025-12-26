import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Service worker registration disabled to prevent stale cached bundles from interfering with auth.
// Additionally, unregister any previously-installed service workers + clear caches.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  }).catch(() => {});
}

if ('caches' in window) {
  caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).catch(() => {});
}

createRoot(document.getElementById("root")!).render(
  <App />
);
