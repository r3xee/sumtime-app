import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { GetAllOrdersServiceMember } from "../../service/order.service";
import { useAuthStore } from "../../store/useAuthStore";
import { Search, Filter, Package, Truck, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, ShoppingBag, X, Loader2, FileText } from "lucide-react";

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
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r ${statusInfo.gradient} text-white shadow-sm`}>
        <Icon size={14} />
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 lg:col-span-2">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <FileText size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">Riwayat Transaksi</h1>
            <p className="text-blue-100">Informasi data riwayat transaksi yang telah dilakukan</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Filter size={20} className="text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Filter & Pencarian</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Jenis Pesanan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Truck size={16} className="text-gray-500" />
                Jenis Pesanan
              </label>
              <select
                value={jenisFilter}
                onChange={(e) => {
                  setJenisFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow transition-all duration-200"
              >
                <option value="">Semua Pesanan</option>
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>

            {/* Status Pesanan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Package size={16} className="text-gray-500" />
                Status Pesanan
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow transition-all duration-200"
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

          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Search size={16} className="text-gray-500" />
              Cari Pesanan
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Cari berdasarkan nomor pesanan..."
                  value={search}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow transition-all duration-200"
                />
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {search && (
                <button
                  onClick={handleClearSearch}
                  className="px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold flex items-center gap-2 shadow-sm hover:shadow"
                >
                  <X size={18} />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Nomor Pesanan
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Pesanan
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Pembayaran
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                        <Loader2 size={32} className="text-white animate-spin" />
                      </div>
                      <p className="text-gray-600 font-medium">Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                        <ShoppingBag size={40} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Belum Ada Pesanan
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Anda belum memiliki riwayat transaksi
                      </p>
                      <button 
                        onClick={() => navigate("/")}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 font-semibold"
                      >
                        Mulai Belanja
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/member/riwayat-transaksi/${order.id}`)}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200 group"
                  >
                    {/* Nomor Pesanan */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <Package size={16} className="text-blue-600" />
                        </div>
                        <div className="text-sm font-mono font-bold text-gray-900">
                          #{order.order_code}
                        </div>
                      </div>
                    </td>

                    {/* Pesanan */}
                    <td className="px-6 py-5">
                      <div className="text-sm font-semibold text-gray-900">
                        {order.order_items?.length || 0} item pesanan
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {order.order_items
                          ?.slice(0, 2)
                          .map((item) => item.nama_produk)
                          .join(", ")}
                        {order.order_items?.length > 2 && " dan lainnya..."}
                      </div>
                    </td>

                    {/* Pembayaran */}
                    <td className="px-6 py-5">
                      <div className="text-base font-bold text-gray-900">
                        {formatCurrency(order.total_harga)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      {getStatusBadge(order.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-gray-200">
            <div className="text-sm font-medium text-gray-700">
              Menampilkan halaman <span className="font-bold text-gray-900">{page}</span> dari <span className="font-bold text-gray-900">{totalPages}</span>
              <span className="text-gray-500 ml-2">({total} total pesanan)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2"
              >
                <ChevronLeft size={18} />
                Prev
              </button>
              <div className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30">
                {page}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-sm hover:shadow flex items-center gap-2"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiwayatTransaksiPage;