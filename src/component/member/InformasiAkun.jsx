import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { User, Phone, Mail } from "lucide-react";

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

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Informasi Akun
        </h2>
        <p className="text-gray-600">Informasi Profilmu Saat Ini</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username || "Avatar"}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {getAvatarPlaceholder(profile?.username)}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {profile?.username || "User"}
              </h3>
              <p className="text-gray-600">
                Total Pembelian {formatCurrency(123456)}
              </p>
            </div>
          </div>
          <Link
            to={"/member/edit-akun"}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Edit Akun
          </Link>
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <User size={20} />
            <span>{profile?.username || "-"}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Phone size={20} />
            <span>{profile?.no_hp || "Belum diisi"}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <Mail size={20} />
            <span>{profile?.email || "-"}</span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Pesanan Saya</h3>
          <button
            onClick={() => navigate("/member/riwayat-pemesanan")}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Riwayat Transaksi
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-600 mt-1">Belum Bayar</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">1</div>
            <div className="text-sm text-gray-600 mt-1">Menunggu Dikirim</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">2</div>
            <div className="text-sm text-gray-600 mt-1">Dikirim</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">3</div>
            <div className="text-sm text-gray-600 mt-1">Selesai</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformasiAkun;
