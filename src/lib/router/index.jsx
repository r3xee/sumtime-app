import { createBrowserRouter } from "react-router";
import App from "../../pages/App";
import Home from "../../pages/home";
import LoginPages from "../../pages/auth/login";
import RegisterPages from "../../pages/auth/register";
import CompleteProfilePages from "../../pages/auth/complete-profile";
import AdminPages from "../../pages/admin";
import MemberPages from "../../pages/member";
import DashboardPage from "../../pages/admin/dashboard";
import InformasiAkunPage from "../../pages/member/informasi-akun";
import RiwayatPemesananPage from "../../pages/member/riwayat-pemesanan";
import { AdminRoute, MemberRoute } from "../../component/ProtectedRoute";
import EditAkunPages from "../../pages/member/edit-akun";

export const router = createBrowserRouter([
  {
    path: "/app",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPages />,
  },
  {
    path: "/register",
    element: <RegisterPages />,
  },
  {
    path: "/complete-profile",
    element: <CompleteProfilePages />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/product",
    element: <product />,
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminPages />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: "/member",
    element: (
      <MemberRoute>
        <MemberPages />
      </MemberRoute>
    ),
    children: [
      {
        index: true,
        element: <InformasiAkunPage />,
      },
      {
        path: "riwayat-pemesanan",
        element: <RiwayatPemesananPage />,
      },
      {
        path: "edit-akun",
        element: <EditAkunPages />,
      },
    ],
  },
]);
