import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  UserCog,
} from "lucide-react";

export const ADMIN_MENU_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    id: "produk",
    label: "Produk",
    icon: Package,
    path: "/admin/produk",
  },
  {
    id: "order",
    label: "Order",
    icon: ShoppingCart,
    path: "/admin/order",
  },
  {
    id: "user",
    label: "User",
    icon: UserCog,
    path: "/admin/user",
  },
];

export const ORDER_STATUS = {
  pending: {
    label: "Pending",
    color: "bg-gray-100 text-gray-800",
  },
  sedang_dibuat: {
    label: "Sedang Dibuat",
    color: "bg-blue-100 text-blue-800",
  },
  sedang_diantar: {
    label: "Sedang Diantar",
    color: "bg-yellow-100 text-yellow-800",
  },
  selesai: {
    label: "Selesai",
    color: "bg-green-100 text-green-800",
  },
  dibatalkan: {
    label: "Dibatalkan",
    color: "bg-red-100 text-red-800",
  },
};
