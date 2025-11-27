import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  ShoppingCart,
  ShoppingBag,
  Package,
  Info,
} from "lucide-react";
import { GetProdukByIdService } from "../../service/produk.service";
import { AddToKeranjangService } from "../../service/keranjang.service";
import { useAuthStore } from "../../store/useAuthStore";
import { showToast } from "../../store/useToastStore";

const ProdukDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      setLoading(true);
      const res = await GetProdukByIdService(id);
      if (res.status) {
        setProduct(res.data);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!authUser) {
      showToast({
        type: "warning",
        heading: "Perlu login",
        description: "Silakan login terlebih dahulu.",
      });
      navigate("/login");
      return;
    }

    const res = await AddToKeranjangService(authUser.id, product.id, 1);
    if (res.status) {
      showToast({
        type: "success",
        heading: "Berhasil",
        description: "Berhasil ditambahkan ke keranjang.",
      });
      navigate("/keranjang");
    } else {
      showToast({
        type: "error",
        heading: "Gagal",
        description: res.message || "Gagal menambahkan ke keranjang.",
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleBuyNow = async () => {
    if (!authUser) {
      showToast({
        type: "warning",
        heading: "Perlu login",
        description: "Silakan login terlebih dahulu.",
      });
      navigate("/login");
      return;
    }

    const res = await AddToKeranjangService(authUser.id, product.id, 1);
    if (res.status) {
      navigate("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="h-10 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse mb-8"></div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            <div className="h-[500px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-3xl animate-pulse"></div>

            <div className="space-y-6">
              <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-4/6"></div>
              </div>
              <div className="pt-8 space-y-4">
                <div className="h-14 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-14 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Produk tidak ditemukan
          </h2>
          <p className="text-gray-600 mb-8">
            Maaf, produk yang Anda cari tidak tersedia atau telah dihapus
          </p>
          <button
            onClick={() => navigate("/produk")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold"
          >
            <ArrowLeft size={20} />
            Kembali ke Produk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/produk")}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mb-8 group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-semibold">Kembali</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          <div className="relative">
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl">
              {product.gambar_url ? (
                <>
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
                  )}
                  <img
                    src={product.gambar_url}
                    alt={product.nama}
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full aspect-square object-cover transition-opacity duration-500 ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </>
              ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full opacity-30 blur-3xl -z-10"></div>
          </div>

          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-3">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {product.nama}
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"></div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <p className="text-sm font-semibold text-blue-600 mb-2">Harga</p>
              <p className="text-4xl font-bold text-gray-900">
                {formatCurrency(product.harga)}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg mt-1">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Deskripsi Produk
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.deskripsi}
                  </p>
                </div>
              </div>

              {product.penyajian && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg mt-1">
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Cara Penyajian
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {product.penyajian}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4 pt-4">
              <button
                onClick={handleBuyNow}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-8 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                <ShoppingBag size={22} />
                Beli Sekarang
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-4 px-8 rounded-xl text-lg font-semibold hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 group"
              >
                <ShoppingCart
                  size={22}
                  className="group-hover:scale-110 transition-transform"
                />
                Tambah ke Keranjang
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-800 text-center">
                💡 <span className="font-semibold">Tips:</span> Pesan sekarang
                dan nikmati dimsum segar langsung ke tangan Anda
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Kualitas Terjamin
            </h3>
            <p className="text-sm text-gray-600">
              Bahan premium dan proses pembuatan higienis
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Pengiriman Cepat
            </h3>
            <p className="text-sm text-gray-600">
              Produk dikirim fresh dalam kondisi terbaik
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
              <Info className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Layanan Terbaik
            </h3>
            <p className="text-sm text-gray-600">
              Customer service siap membantu Anda
            </p>
          </div>
        </div>
      </div>

      <div className="absolute top-20 right-10 w-40 h-40 bg-yellow-100 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-pink-100 rounded-full opacity-20 blur-3xl -z-10"></div>
    </div>
  );
};

export default ProdukDetailPage;
