import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./style/index.css";
import { router } from "./lib/router/index.jsx";
import { RouterProvider } from "react-router";
import { useAuthStore } from "./store/useAuthStore";
import 'leaflet/dist/leaflet.css';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
