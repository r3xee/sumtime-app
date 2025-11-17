import { Outlet, useNavigate, useLocation } from "react-router";
import { User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import Navbar from "../component/ui/navbar";

const MemberLayout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[url('../background.png')] bg-repeat-y bg-center relative">
      <div className="absolute inset-0 z-0 bg-white opacity-70"></div>
      <Navbar />
      <main className="pt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 space-y-2">
                <button
                  onClick={() => navigate("/member")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                    location.pathname === "/member"
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <User size={20} />
                  <span>Informasi Akun</span>
                </button>
                <button
                  onClick={() => navigate("/member/riwayat-pemesanan")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
                    location.pathname === "/member/riwayat-pemesanan" ||
                    location.pathname.startsWith("/member/riwayat-transaksi")
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Riwayat Pemesanan</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Keluar Dari Akun</span>
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
