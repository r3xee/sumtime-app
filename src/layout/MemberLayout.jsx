import { Outlet, useNavigate, useLocation } from "react-router";
import { User, FileText, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import Navbar from "../component/ui/navbar";
import { showToast } from "../store/useToastStore";

const MemberLayout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: User,
      label: "Informasi Akun",
      path: "/member",
      isActive: location.pathname === "/member"
    },
    {
      icon: FileText,
      label: "Riwayat Pemesanan",
      path: "/member/riwayat-pemesanan",
      isActive: location.pathname === "/member/riwayat-pemesanan" ||
               location.pathname.startsWith("/member/riwayat-transaksi")
    }
  ];

  const handleLogout = async () => {
    await logout();

    showToast({
      type: "success",
      heading: "Berhasil Keluar",
      description: "Berhasil keluar dari akun anda",
    })
  }

  return (
    <div className="min-h-screen bg-[url('../background.png')] bg-repeat-y bg-center relative">
      <div className="absolute inset-0 z-0 bg-white opacity-70"></div>
      <Navbar />
      <main className="pt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6 space-y-3">
                {/* Header */}
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-800 mb-1">Menu Akun</h2>
                  <p className="text-sm text-gray-500">Kelola profil dan pesanan Anda</p>
                </div>

                {/* Navigation Items */}
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`
                      group w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium
                      transition-all duration-300 ease-out
                      ${item.isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]"
                        : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md hover:scale-[1.01] border border-gray-100"
                      }
                    `}
                  >
                    <div className={`
                      p-2 rounded-lg transition-colors duration-300
                      ${item.isActive
                        ? "bg-white/20"
                        : "bg-gray-100 group-hover:bg-blue-100"
                      }
                    `}>
                      <item.icon 
                        size={20} 
                        className={item.isActive ? "text-white" : "text-gray-600 group-hover:text-blue-600"}
                      />
                    </div>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                    )}
                  </button>
                ))}

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="
                    group w-full flex items-center gap-4 px-5 py-4 rounded-xl
                    bg-white text-gray-700 font-medium border border-gray-100
                    hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50
                    hover:border-red-200 hover:shadow-md hover:scale-[1.01]
                    transition-all duration-300 ease-out
                  "
                >
                  <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors duration-300">
                    <LogOut 
                      size={20} 
                      className="text-gray-600 group-hover:text-red-600 transition-colors duration-300"
                    />
                  </div>
                  <span className="flex-1 text-left group-hover:text-red-600 transition-colors duration-300">
                    Keluar Dari Akun
                  </span>
                </button>
              </div>

           
            </div>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberLayout;