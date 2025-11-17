import { useState, useEffect, useCallback } from "react";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import {
  GetKeranjangByUserService,
  UpdateKeranjangService,
  DeleteFromKeranjangService,
} from "../../service/keranjang.service";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router";

const KeranjangComponent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const fetchKeranjang = useCallback(async () => {
    if (!authUser) return;

    setLoading(true);
    const res = await GetKeranjangByUserService(authUser.id);

    if (res.status) {
      setItems(res.data);
    }

    setLoading(false);
  }, [authUser]);

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }
    fetchKeranjang();
  }, [authUser, navigate, fetchKeranjang]);

  const handleUpdateJumlah = async (id, currentJumlah, change) => {
    const newJumlah = currentJumlah + change;
    if (newJumlah < 1) return;

    const res = await UpdateKeranjangService(id, newJumlah);
    if (res.status) {
      fetchKeranjang();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus item dari keranjang?")) return;

    const res = await DeleteFromKeranjangService(id);
    if (res.status) {
      fetchKeranjang();
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(items.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const calculateTotal = () => {
    return items
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.produk.harga * item.jumlah, 0);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Pilih minimal 1 produk");
      return;
    }

    const selectedItemsData = items.filter((item) =>
      selectedItems.includes(item.id)
    );
    navigate("/checkout", { state: { items: selectedItemsData } });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Keranjang</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <ShoppingBag className="mx-auto mb-4 text-gray-400" size={64} />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Keranjang Kosong
            </h2>
            <p className="text-gray-500 mb-6">
              Belum ada produk di keranjang Anda
            </p>
            <button
              onClick={() => navigate("/produk")}
              className="bg-blue-400 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-500 transition"
            >
              Belanja Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Select All */}
              <div className="bg-white rounded-lg p-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedItems.length === items.length}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded border-gray-300"
                />
                <span className="font-medium">Pilih semua</span>
              </div>

              {/* Items */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-4 flex items-center gap-4"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="w-5 h-5 rounded border-gray-300"
                  />

                  <img
                    src={item.produk.gambar_url || "/placeholder.png"}
                    alt={item.produk.nama}
                    className="w-24 h-24 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {item.produk.nama}
                    </h3>
                    <p className="text-blue-600 font-medium mt-1">
                      {formatCurrency(item.produk.harga)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleUpdateJumlah(item.id, item.jumlah, -1)
                      }
                      className="p-1 border rounded hover:bg-gray-50"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {item.jumlah}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateJumlah(item.id, item.jumlah, 1)
                      }
                      className="p-1 border rounded hover:bg-gray-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Ringkasan Belanja</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Total ({selectedItems.length} item)
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  className="w-full bg-blue-400 text-white py-3 rounded-full font-medium hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Beli
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeranjangComponent;
