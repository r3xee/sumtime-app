import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { User, Phone, Mail, ShoppingBag, Clock, Truck, CheckCircle, Edit3, ArrowRight } from "lucide-react";

const InformasiAkun = () => {
  const navigate = useNavigate();
  const { profile } = useAuthStore();

  const getAvatarPlaceholder = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const orderStats = [
    {
      icon: Clock,
      label: "Belum Bayar",
      count: 0,
      color: "orange",
      bgGradient: "from-orange-500 to-amber-500"
    },
    {
      icon: ShoppingBag,
      label: "Menunggu Dikirim",
      count: 1,
      color: "blue",
      bgGradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Truck,
      label: "Dikirim",
      count: 2,
      color: "purple",
      bgGradient: "from-purple-500 to-pink-500"
    },
    {
      icon: CheckCircle,
      label: "Selesai",
      count: 3,
      color: "green",
      bgGradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Informasi Akun</h2>
          <p className="text-blue-100">Kelola profil dan lihat aktivitas Anda</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username || "Avatar"}
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg ring-4 ring-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg ring-4 ring-white">
                  <span className="text-4xl font-bold text-white">
                    {getAvatarPlaceholder(profile?.username)}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {profile?.username || "User"}
              </h3>
              <div className="flex items-center gap-2 text-gray-600">
                <ShoppingBag size={16} />
                <span className="text-sm">Total Pembelian</span>
              </div>
              <p className="text-xl font-bold text-blue-600 mt-1">
                {formatCurrency(123456)}
              </p>
            </div>
          </div>
          <Link
            to={"/member/edit-akun"}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 font-medium"
          >
            <Edit3 size={18} />
            <span>Edit Akun</span>
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Username</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {profile?.username || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Phone size={20} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">No. Telepon</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {profile?.no_hp || "Belum diisi"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail size={20} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {profile?.email || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Pesanan Saya</h3>
            <p className="text-sm text-gray-600">Status pesanan terkini Anda</p>
          </div>
          <button
            onClick={() => navigate("/member/riwayat-pemesanan")}
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-xl hover:bg-blue-50 border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow transition-all duration-300 font-medium"
          >
            <span>Lihat Semua</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {orderStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-3 bg-gradient-to-br ${stat.bgGradient} rounded-xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stat.count}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InformasiAkun;