import { router } from "./lib/router/index.jsx";
import { RouterProvider } from "react-router";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <RouterProvider router={router} />;
}

export default App;
