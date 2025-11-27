import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { GetRandomProdukService } from "../../service/produk.service";
import { AddToKeranjangService } from "../../service/keranjang.service";
import { useAuthStore } from "../../store/useAuthStore";
import { showToast } from "../../store/useToastStore";
import { useNavigate } from "react-router";
import LoadingSkeleton from "./ui/LoadingProduct";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await GetRandomProdukService(3);
    if (res.status) {
      setProducts(res.data);
    }
    setLoading(false);
  };

  const handleAddToCart = async (produkId) => {
    if (!authUser) {
      showToast({
        type: "warning",
        heading: "Perlu login",
        description: "Silakan login terlebih dahulu.",
      });
      navigate("/login");
      return;
    }

    const res = await AddToKeranjangService(authUser.id, produkId, 1);
    if (res.status) {
      showToast({
        type: "success",
        heading: "Berhasil",
        description: "Berhasil ditambahkan ke keranjang.",
      });
    } else {
      showToast({
        type: "error",
        heading: "Gagal",
        description: res.message || "Gagal menambahkan ke keranjang.",
      });
    }
  };

  const handleBuyNow = (produkId) => {
    if (!authUser) {
      showToast({
        type: "warning",
        heading: "Perlu login",
        description: "Silakan login terlebih dahulu.",
      });
      navigate("/login");
      return;
    }

    AddToKeranjangService(authUser.id, produkId, 1).then((res) => {
      if (res.status) {
        navigate("/checkout");
      }
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <section className="pt-12">
        <div className="container mx-auto px-4">
          <h1
            className="text-center text-6xl font-bold mb-12 text-blue-400"
            style={{
              textShadow: "2px 2px 0px rgba(59, 130, 246, 0.3)",
              letterSpacing: "0.05em",
            }}
          >
            PRODUK
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/produk/${product.id}`)}
                className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer flex flex-col"
              >
                <div className="p-6 flex justify-between flex-col h-full">
                  <div className="h-[200px] rounded-lg overflow-hidden">
                    {product.gambar_url ? (
                      <img
                        src={product.gambar_url}
                        alt={product.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 mb-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {product.nama}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {product.deskripsi.length > 80
                        ? product.deskripsi.slice(0, 80) + "..."
                        : product.deskripsi}
                    </p>
                  </div>

                  <div className="mt-3 mb-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(product.harga)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between space-x-4 mt-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyNow(product.id);
                      }}
                      className="flex items-center justify-center px-17 py-2 border border-black rounded-full text-black font-semibold hover:bg-black hover:text-white transition-colors"
                    >
                      Beli Sekarang
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                      className="p-2 border border-transparent hover:border-black rounded-full transition-colors"
                    >
                      <ShoppingCart className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedProducts;
