import { createBrowserRouter } from "react-router";
import App from "../../pages/App";
import Home from "../../pages/home";
import LoginPages from "../../pages/auth/login";
import RegisterPages from "../../pages/auth/register";
import CompleteProfilePages from "../../pages/auth/complete-profile";
import AdminPages from "../../pages/admin";
import MemberPages from "../../pages/member";
import DashboardPage from "../../pages/admin/dashboard";
import AdminProdukPage from "../../pages/admin/produk";
import OrderPage from "../../pages/admin/order";
import UserPage from "../../pages/admin/user";
import EditProfilePage from "../../pages/admin/edit-profile";
import InformasiAkunPage from "../../pages/member/informasi-akun";
import RiwayatPemesananPage from "../../pages/member/riwayat-pemesanan";
import RiwayatTransaksiPage from "../../pages/member/riwayat-transaksi";
import RiwayatDetailPage from "../../pages/member/riwayat-detail";
import EditAkunPages from "../../pages/member/edit-akun";
import ProdukPages from "../../pages/produk";
import DetailProdukPages from "../../pages/detail-produk";
import KeranjangPage from "../../pages/keranjang";
// import AuthCallback from "../../pages/AuthCallback";
import CheckoutPage from "../../pages/checkout";
import { AdminRoute, MemberRoute } from "../../component/ProtectedRoute";

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
    path: "/produk",
    element: <ProdukPages />,
  },
  {
    path: "/produk/:id",
    element: <DetailProdukPages />,
  },
  {
    path: "/keranjang",
    element: <KeranjangPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  // {
  //   path: "/auth/callback",
  //   element: <AuthCallback />,
  // },
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
      {
        path: "produk",
        element: <AdminProdukPage />,
      },
      {
        path: "order",
        element: <OrderPage />,
      },
      {
        path: "user",
        element: <UserPage />,
      },
      {
        path: "edit-profile",
        element: <EditProfilePage />,
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
        path: "riwayat-transaksi",
        element: <RiwayatTransaksiPage />,
      },
      {
        path: "riwayat-transaksi/:id",
        element: <RiwayatDetailPage />,
      },
      {
        path: "edit-akun",
        element: <EditAkunPages />,
      },
    ],
  },
]);
