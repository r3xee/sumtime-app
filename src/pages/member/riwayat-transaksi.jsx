import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { GetAllOrdersServiceMember } from "../../service/order.service";
import { useAuthStore } from "../../store/useAuthStore";

const RiwayatTransaksiPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 10;
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      fetchOrders();
    }
  }, [page, search, jenisFilter, statusFilter, authUser]);

  const fetchOrders = async () => {
    setLoading(true);
  const res = await GetAllOrdersServiceMember(authUser.id, {
      page,
      limit,
      search,
      status: statusFilter,
    });

    if (res.status) {
      setOrders(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value.trim();
    setSearch(value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearch("");
    setPage(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
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
        className={`px-3 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  return (
    <>
   
    <div className="space-y-6 lg:col-span-2">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Riwayat Transaksi</h1>
        <p className="text-gray-600 mt-1">
          Informasi data riwayat transaksi yang telah dilakukan
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Jenis Pesanan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Pesanan
            </label>
            <select
              value={jenisFilter}
              onChange={(e) => {
                setJenisFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Pesanan</option>
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>

          {/* Status Pesanan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Pesanan
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="sedang_dibuat">Sedang Dibuat</option>
              <option value="sedang_diantar">Sedang Diantar</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>
        </div>

        {/* Cari Pesanan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cari Pesanan
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cari berdasarkan nomor pesanan..."
              value={search}
              onChange={handleSearch}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {search && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Nomor Pesanan
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Pesanan
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Pembayaran
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  </div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  Belum ada pesanan
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => navigate(`/member/riwayat-transaksi/${order.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition"
                >
                  {/* Nomor Pesanan */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-mono text-gray-900">
                      #{order.order_code}
                    </div>
                  </td>

                  {/* Pesanan */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.order_items?.length || 0} item
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.order_items
                        ?.slice(0, 2)
                        .map((item) => item.nama_produk)
                        .join(", ")}
                      {order.order_items?.length > 2 && "..."}
                    </div>
                  </td>

                  {/* Pembayaran */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(order.total_harga)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="px-4 py-2 bg-white border border-gray-300 rounded">
                {page}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default RiwayatTransaksiPage;
