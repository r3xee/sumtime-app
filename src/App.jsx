import { router } from "./lib/router/index.jsx";
import { RouterProvider } from "react-router";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import ToastContainer from "./component/ui/ToastContainer";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
