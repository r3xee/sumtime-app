import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { LogOut, Edit } from "lucide-react";
import KPICards from "./dashboard/KPICards";
import SalesChart from "./dashboard/SalesChart";
import OrderStatusChart from "./dashboard/OrderStatusChart";
import {
  GetDashboardStatsService,
  GetSalesChartService,
  GetOrderStatusChartService,
} from "../../service/dashboard.service";

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, logout } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    const [statsRes, salesRes, statusRes] = await Promise.all([
      GetDashboardStatsService(),
      GetSalesChartService(),
      GetOrderStatusChartService(),
    ]);

    if (statsRes.status) setStats(statsRes.data);
    if (salesRes.status) setSalesData(salesRes.data);
    if (statusRes.status) setStatusData(statusRes.data);

    setLoading(false);
  };

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
      await logout();
    }
  };


  // Generate avatar placeholder jika tidak ada avatar_url
  const getAvatarPlaceholder = (name) => {
    if (!name) return "A";
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="p-3 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      {/* Header */}
      <h1 className="text-xl md:text-3xl font-bold text-gray-900">
        Dashboard
      </h1>

      {/* Welcome Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <p className="text-sm md:text-base text-gray-700">
          Selamat Datang di halaman Dashboard Admin SumTime!
        </p>
      </div>

      {/* Profile Info Card - Responsive */}
      <div className="bg-gray-100 rounded-lg p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.nama_lengkap || "Avatar"}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-yellow-400 flex items-center justify-center">
                <span className="text-3xl md:text-4xl font-bold text-white">
                  {getAvatarPlaceholder(profile?.nama_lengkap)}
                </span>
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              {profile?.nama_lengkap || "Admin"}
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-2">
              {profile?.email || "-"}
            </p>
            <p className="text-sm text-gray-700 mb-4">
              Bergabung: {formatDate(profile?.created_at)}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                onClick={() => navigate("/admin/edit-profile")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
              >
                <Edit size={16} />
                Edit Akun
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      ) : (
        <>
          <KPICards stats={stats} />

          {/* Charts - Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <SalesChart data={salesData} />
            <OrderStatusChart data={statusData} />
          </div>
        </>
      )}

    </div>
  );
};

export default Dashboard;
