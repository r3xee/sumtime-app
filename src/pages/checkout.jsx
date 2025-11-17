import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useNavigate, useLocation } from "react-router";
import { Loader2 } from "lucide-react";
import { CreateOrderService } from "../service/checkout.service";
import { GetKeranjangByUserService } from "../service/keranjang.service";
import { useAuthStore } from "../store/useAuthStore";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component untuk handle click pada map
function LocationMarker({ position, setPosition, setAddress }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      // Reverse geocoding untuk mendapatkan alamat
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
      )
        .then((res) => res.json())
        .then((data) => {
          setAddress(data.display_name);
        })
        .catch((err) => {
          console.error("Error getting address:", err);
        });
    },
  });

  return position === null ? null : <Marker position={position} />;
}

const CheckoutPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [catatan, setCatatan] = useState("");
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
      return;
    }

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
          
          // Get address from coordinates
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((res) => res.json())
            .then((data) => {
              setAddress(data.display_name);
            });
        },
        () => {
          // Default to Jakarta if geolocation fails
          setPosition({ lat: -6.2088, lng: 106.8456 });
        }
      );
    } else {
      setPosition({ lat: -6.2088, lng: 106.8456 });
    }

    fetchItems();
  }, [authUser]);

  const fetchItems = async () => {
    setLoading(true);

    // Check if items passed from keranjang page
    if (location.state?.items) {
      setItems(location.state.items);
      setLoading(false);
      return;
    }

    // Otherwise, get all items from keranjang
    const res = await GetKeranjangByUserService(authUser.id);
    if (res.status) {
      setItems(res.data);
    }
    setLoading(false);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.produk.harga * item.jumlah, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address) {
      alert("Pilih lokasi pengiriman di map");
      return;
    }

    if (items.length === 0) {
      alert("Keranjang kosong");
      return;
    }

    setSubmitting(true);

    const orderData = {
      userId: authUser.id,
      alamatPengiriman: address,
      catatan: catatan,
      items: items,
    };

    const res = await CreateOrderService(orderData);

    setSubmitting(false);

    if (!res.status) {
      alert(res.message);
      return;
    }

    alert("Pesanan berhasil dibuat!");
    navigate("/member/riwayat-pemesanan");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading || !position) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Pilih Lokasi Pengiriman</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Klik pada map untuk memilih lokasi pengiriman
                </p>
                <div className="h-96 rounded-lg overflow-hidden border-2 border-gray-200">
                  <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker
                      position={position}
                      setPosition={setPosition}
                      setAddress={setAddress}
                    />
                  </MapContainer>
                </div>
              </div>

              {/* Alamat Lengkap */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Alamat Lengkap</h2>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={4}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  placeholder="Alamat akan terisi otomatis saat memilih lokasi di map"
                />
              </div>

              {/* Catatan */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Catatan (Opsional)</h2>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  placeholder="Tambahkan catatan untuk pesanan Anda"
                />
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Ringkasan Pesanan</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.produk.gambar_url || "/placeholder.png"}
                        alt={item.produk.nama}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">
                          {item.produk.nama}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.jumlah} x {formatCurrency(item.produk.harga)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-400 text-white py-3 rounded-full font-medium hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Memproses...
                    </>
                  ) : (
                    "Lanjutkan Pembayaran"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
