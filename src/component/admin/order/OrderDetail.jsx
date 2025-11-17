import { useState } from "react";
import { X, Loader2, User, MapPin, FileText } from "lucide-react";
import { UpdateOrderStatusService } from "../../../service/order.service";
import { ORDER_STATUS } from "../../../constants/dashboard.constant";

const OrderDetail = ({ order, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(order.status);

  const handleUpdateStatus = async () => {
    if (status === order.status) {
      alert("Status tidak berubah");
      return;
    }

    if (!confirm("Apakah Anda yakin ingin mengubah status order ini?")) return;

    setLoading(true);
    const res = await UpdateOrderStatusService(order.id, status);
    setLoading(false);

    if (!res.status) {
      alert(res.message);
      return;
    }

    alert("Status order berhasil diupdate");
    onClose(true);
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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Detail Order</h1>
          <p className="text-gray-600 mt-1">
            Order ID: #{order.order_code}
          </p>
        </div>
        <button
          onClick={() => onClose(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Item Pesanan
            </h2>
            <div className="space-y-3">
              {order.order_items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.nama_produk}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(item.harga)} x {item.jumlah}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(order.total_harga)}
                </span>
              </div>
            </div>
          </div>

          {/* Alamat Pengiriman */}
          {order.alamat_pengiriman && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={20} className="text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Alamat Pengiriman
                </h2>
              </div>
              <p className="text-gray-700">{order.alamat_pengiriman}</p>
            </div>
          )}

          {/* Catatan */}
          {order.catatan && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={20} className="text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Catatan
                </h2>
              </div>
              <p className="text-gray-700">{order.catatan}</p>
            </div>
          )}
        </div>

        {/* Right Column - Customer & Status */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Informasi Pelanggan
              </h2>
            </div>
            <div className="space-y-3">
              {order.profiles?.avatar_url ? (
                <img
                  src={order.profiles.avatar_url}
                  alt={order.profiles.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={24} className="text-gray-400" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {order.profiles?.username || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  {order.profiles?.email || "N/A"}
                </p>
                {order.profiles?.no_hp && (
                  <p className="text-sm text-gray-500">
                    {order.profiles.no_hp}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Status Order
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Saat Ini
                </label>
                <span
                  className={`inline-block px-3 py-1 text-sm font-medium rounded ${
                    ORDER_STATUS[order.status]?.color ||
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {ORDER_STATUS[order.status]?.label || order.status}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="sedang_dibuat">Sedang Dibuat</option>
                  <option value="sedang_diantar">Sedang Diantar</option>
                  <option value="selesai">Selesai</option>
                  <option value="dibatalkan">Dibatalkan</option>
                </select>
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={loading || status === order.status}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Mengupdate...
                  </>
                ) : (
                  "Update Status"
                )}
              </button>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informasi Order
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tanggal Order:</span>
                <span className="text-gray-900 font-medium">
                  {formatDate(order.created_at)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Terakhir Update:</span>
                <span className="text-gray-900 font-medium">
                  {formatDate(order.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
