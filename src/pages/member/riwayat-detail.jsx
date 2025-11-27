import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Loader2, Package, MapPin, MessageSquare, Clock, CheckCircle, Truck, XCircle, Calendar, ShoppingBag } from "lucide-react";
import { GetOrderByIdService } from "../../service/checkout.service";
import { useAuthStore } from "../../store/useAuthStore";
import { showToast } from "../../store/useToastStore";

const RiwayatDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    const res = await GetOrderByIdService(id);

    if (res.status) {
      if (res.data.user_id === authUser.id) {
        setOrder(res.data);
      } else {
        showToast({
          type: "error",
          heading: "Akses ditolak",
          description: "Anda tidak memiliki akses ke order ini.",
        });
        navigate("/member/riwayat-pemesanan");
      }
    } else {
      showToast({
        type: "error",
        heading: "Gagal memuat pesanan",
        description: res.message || "Terjadi kesalahan saat mengambil data.",
      });
      navigate("/member/riwayat-pemesanan");
    }

    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { 
        label: "Pending", 
        gradient: "from-yellow-500 to-amber-500",
        icon: Clock
      },
      sedang_dibuat: {
        label: "Sedang Dibuat",
        gradient: "from-blue-500 to-cyan-500",
        icon: Package
      },
      sedang_diantar: {
        label: "Sedang Diantar",
        gradient: "from-purple-500 to-pink-500",
        icon: Truck
      },
      selesai: { 
        label: "Selesai", 
        gradient: "from-green-500 to-emerald-500",
        icon: CheckCircle
      },
      dibatalkan: { 
        label: "Dibatalkan", 
        gradient: "from-red-500 to-rose-500",
        icon: XCircle
      },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      gradient: "from-gray-500 to-gray-600",
      icon: Package
    };

    const Icon = statusInfo.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r ${statusInfo.gradient} text-white shadow-lg`}>
        <Icon size={18} />
        {statusInfo.label}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="lg:col-span-2 flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
          <Loader2 className="animate-spin text-white" size={40} />
        </div>
        <p className="text-gray-600 font-medium">Memuat detail pesanan...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="lg:col-span-2">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="text-gray-400" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pesanan Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-6">
            Pesanan yang Anda cari tidak tersedia atau telah dihapus
          </p>
          <button
            onClick={() => navigate("/member/riwayat-pemesanan")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 font-semibold"
          >
            Kembali ke Riwayat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/member/riwayat-pemesanan")}
        className="group inline-flex items-center gap-2 px-5 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow transition-all duration-200 font-semibold"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Kembali</span>
      </button>

      {/* Order Header */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <ShoppingBag size={24} />
                </div>
                <h1 className="text-3xl font-bold">
                  Pesanan #{order.order_code}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-blue-100">
                <Calendar size={16} />
                <p>{formatDate(order.created_at)}</p>
              </div>
            </div>
            <div>{getStatusBadge(order.status)}</div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5 border-b-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Detail Pesanan</h2>
          </div>
        </div>
        
        <div className="p-8 space-y-4">
          {order.order_items?.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  {item.nama_produk}
                </h3>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">{item.jumlah}</span> x {formatCurrency(item.harga)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(item.subtotal)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8">
          <div className="flex items-center justify-between text-white">
            <span className="text-xl font-bold">Total Pembayaran</span>
            <span className="text-3xl font-bold">
              {formatCurrency(order.total_harga)}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alamat Pengiriman */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Alamat Pengiriman
            </h3>
          </div>
          <p className="text-gray-700 leading-relaxed bg-white rounded-xl p-4 border border-gray-100">
            {order.alamat_pengiriman || "-"}
          </p>
        </div>

        {/* Catatan */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <MessageSquare size={20} className="text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Catatan</h3>
          </div>
          <p className="text-gray-700 leading-relaxed bg-white rounded-xl p-4 border border-gray-100">
            {order.catatan || "Tidak ada catatan"}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Clock size={20} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Timeline Status Pesanan</h3>
        </div>

        <div className="space-y-6">
          {/* Pesanan Diterima */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle size={20} className="text-white" />
              </div>
              {order.status !== "pending" && order.status !== "dibatalkan" && (
                <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-blue-300 my-2"></div>
              )}
            </div>
            <div className="flex-1 pt-1">
              <p className="font-bold text-gray-900 mb-1">Pesanan Diterima</p>
              <p className="text-sm text-gray-600">
                {formatDate(order.created_at)}
              </p>
            </div>
          </div>

          {order.status !== "pending" && order.status !== "dibatalkan" && (
            <>
              {/* Sedang Dibuat */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                      ["sedang_dibuat", "sedang_diantar", "selesai"].includes(order.status)
                        ? "bg-gradient-to-br from-blue-500 to-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <Package size={20} className="text-white" />
                  </div>
                  {["sedang_diantar", "selesai"].includes(order.status) && (
                    <div className="w-1 h-16 bg-gradient-to-b from-blue-500 to-blue-300 my-2"></div>
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-bold text-gray-900 mb-1">Sedang Dibuat</p>
                  <p className="text-sm text-gray-600">Proses pembuatan pesanan</p>
                </div>
              </div>

              {/* Sedang Diantar */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                      ["sedang_diantar", "selesai"].includes(order.status)
                        ? "bg-gradient-to-br from-purple-500 to-purple-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <Truck size={20} className="text-white" />
                  </div>
                  {order.status === "selesai" && (
                    <div className="w-1 h-16 bg-gradient-to-b from-purple-500 to-purple-300 my-2"></div>
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-bold text-gray-900 mb-1">Sedang Diantar</p>
                  <p className="text-sm text-gray-600">Pesanan dalam perjalanan</p>
                </div>
              </div>

              {/* Selesai */}
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    order.status === "selesai"
                      ? "bg-gradient-to-br from-green-500 to-green-600"
                      : "bg-gray-300"
                  }`}
                >
                  <CheckCircle size={20} className="text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="font-bold text-gray-900 mb-1">Selesai</p>
                  <p className="text-sm text-gray-600">Pesanan telah diterima</p>
                </div>
              </div>
            </>
          )}

          {/* Dibatalkan */}
          {order.status === "dibatalkan" && (
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <XCircle size={20} className="text-white" />
              </div>
              <div className="flex-1 pt-1">
                <p className="font-bold text-gray-900 mb-1">Dibatalkan</p>
                <p className="text-sm text-gray-600">Pesanan telah dibatalkan</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiwayatDetailPage;