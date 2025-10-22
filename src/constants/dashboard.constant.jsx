import { Home, Package, Users, ShoppingCart, Tag, User } from "lucide-react";

export const ADMIN_MENU_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    path: "/admin",
  },
  {
    id: "produk",
    label: "Produk",
    icon: Package,
    path: "/admin/produk",
  },
  {
    id: "kategori",
    label: "Kategori",
    icon: Tag,
    path: "/admin/kategori",
  },
  {
    id: "order",
    label: "Order",
    icon: ShoppingCart,
    path: "/admin/order",
  },
  {
    id: "admin",
    label: "Admin",
    icon: User,
    path: "/admin/admin",
  },
  {
    id: "member",
    label: "Member",
    icon: Users,
    path: "/admin/member",
  },
];
