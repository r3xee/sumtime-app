import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { GetOrderByIdService } from "../../service/checkout.service";
import { useAuthStore } from "../../store/useAuthStore";

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
      // Verify order belongs to current user
      if (res.data.user_id === authUser.id) {
        setOrder(res.data);
      } else {
        alert("Anda tidak memiliki akses ke order ini");
        navigate("/member/riwayat-pemesanan");
      }
    } else {
      alert(res.message);
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
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      sedang_dibuat: {
        label: "Sedang Dibuat",
        color: "bg-blue-100 text-blue-800",
      },
      sedang_diantar: {
        label: "Sedang Diantar",
        color: "bg-purple-100 text-purple-800",
      },
      selesai: { label: "Selesai", color: "bg-green-100 text-green-800" },
      dibatalkan: { label: "Dibatalkan", color: "bg-red-100 text-red-800" },
    };

    const statusInfo = statusMap[status] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-4 py-2 text-sm font-medium rounded-full ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="lg:col-span-2 flex items-center justify-center py-12">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 text-center">
        <Package className="mx-auto mb-4 text-gray-400" size={64} />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Pesanan Tidak Ditemukan
        </h2>
        <button
          onClick={() => navigate("/member/riwayat-pemesanan")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Kembali ke Riwayat
        </button>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/member/riwayat-pemesanan")}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
      </div>

      {/* Order Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pesanan #{order.order_code}
            </h1>
            <p className="text-gray-600">
              Tanggal: {formatDate(order.created_at)}
            </p>
          </div>
          <div>{getStatusBadge(order.status)}</div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Detail Pesanan
          </h2>
          <div className="space-y-4">
            {order.order_items?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {item.nama_produk}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.jumlah} x {formatCurrency(item.harga)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-blue-600">
              {formatCurrency(order.total_harga)}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alamat Pengiriman */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Alamat Pengiriman
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {order.alamat_pengiriman || "-"}
          </p>
        </div>

        {/* Catatan */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Catatan</h3>
          <p className="text-gray-700 leading-relaxed">
            {order.catatan || "-"}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Status Pesanan
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <div className="w-1 h-12 bg-gray-200 my-2"></div>
            </div>
            <div>
              <p className="font-medium text-gray-900">Pesanan Diterima</p>
              <p className="text-sm text-gray-600">
                {formatDate(order.created_at)}
              </p>
            </div>
          </div>

          {order.status !== "pending" && (
            <>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      ["sedang_dibuat", "sedang_diantar", "selesai"].includes(
                        order.status
                      )
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="w-1 h-12 bg-gray-200 my-2"></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sedang Dibuat</p>
                  <p className="text-sm text-gray-600">Proses pembuatan pesanan</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      ["sedang_diantar", "selesai"].includes(order.status)
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="w-1 h-12 bg-gray-200 my-2"></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Sedang Diantar</p>
                  <p className="text-sm text-gray-600">Pesanan dalam perjalanan</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div
                  className={`w-4 h-4 rounded-full ${
                    order.status === "selesai" ? "bg-blue-500" : "bg-gray-300"
                  }`}
                ></div>
                <div>
                  <p className="font-medium text-gray-900">Selesai</p>
                  <p className="text-sm text-gray-600">Pesanan telah diterima</p>
                </div>
              </div>
            </>
          )}

          {order.status === "dibatalkan" && (
            <div className="flex items-start gap-4">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div>
                <p className="font-medium text-gray-900">Dibatalkan</p>
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
