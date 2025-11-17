import { useState, useEffect } from "react";
import { Search, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { GetAllProdukService } from "../../service/produk.service";
import { AddToKeranjangService } from "../../service/keranjang.service";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router";

const ProdukComponent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 6;
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const res = await GetAllProdukService({
        page,
        limit,
        search,
        isActive: true,
      });

      if (res.status) {
        setProducts(res.data);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [page, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleAddToCart = async (produkId) => {
    if (!authUser) {
      alert("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    const res = await AddToKeranjangService(authUser.id, produkId, 1);
    if (res.status) {
      alert("Berhasil ditambahkan ke keranjang");
    } else {
      alert(res.message);
    }
  };

  const handleBuyNow = (produkId) => {
    if (!authUser) {
      alert("Silakan login terlebih dahulu");
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

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="bg-white rounded-2xl overflow-hidden shadow-sm"
        >
          <div className="h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-5/6"></div>
            </div>
            <div className="flex gap-3 pt-4">
              <div className="h-10 flex-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-10 w-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-16">
          {/* Title */}
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">
              Produk Kami
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Jelajahi berbagai pilihan dimsum berkualitas dengan cita rasa
              autentik
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <Search
                className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                size={22}
              />
              <input
                type="text"
                placeholder="Cari produk favorit Anda..."
                value={search}
                onChange={handleSearch}
                className="w-full pl-14 pr-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Results Info */}
          {!loading && (
            <div className="text-center mt-6">
              <p className="text-gray-600">
                {total > 0 ? (
                  <>
                    Menampilkan{" "}
                    <span className="font-semibold text-gray-900">{total}</span>{" "}
                    produk
                    {search && (
                      <span className="ml-1">
                        untuk{" "}
                        <span className="font-semibold text-blue-600">
                          "{search}"
                        </span>
                      </span>
                    )}
                  </>
                ) : null}
              </p>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <LoadingSkeleton />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Produk tidak ditemukan
              </h3>
              <p className="text-gray-600">
                Coba gunakan kata kunci lain atau jelajahi semua produk kami
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  Lihat Semua Produk
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                >
                  {/* Image Container */}
                  <div
                    onClick={() => navigate(`/produk/${product.id}`)}
                    className="relative h-64 overflow-hidden bg-gray-100"
                  >
                    {product.gambar_url ? (
                      <img
                        src={product.gambar_url}
                        alt={product.nama}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div
                      onClick={() => navigate(`/produk/${product.id}`)}
                      className="mb-4"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {product.nama}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {product.deskripsi}
                      </p>
                    </div>

                    <div className="mt-3 mb-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(product.harga)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNow(product.id);
                        }}
                        className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                      >
                        Beli Sekarang
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product.id);
                        }}
                        className="p-2.5 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-300 group/cart"
                      >
                        <ShoppingCart className="w-5 h-5 text-gray-600 group-hover/cart:text-blue-500 transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white transition-all"
                  >
                    <ChevronLeft size={20} className="text-gray-700" />
                  </button>

                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      // Show only relevant pages
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= page - 1 && pageNum <= page + 1)
                      ) {
                        return (
                          <button
                            key={i}
                            onClick={() => setPage(pageNum)}
                            className={`min-w-[44px] h-11 px-4 rounded-xl font-semibold transition-all ${
                              page === pageNum
                                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                                : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (pageNum === page - 2 || pageNum === page + 2) {
                        return (
                          <span key={i} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white transition-all"
                  >
                    <ChevronRight size={20} className="text-gray-700" />
                  </button>
                </div>

                {/* Page Info */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Halaman{" "}
                    <span className="font-semibold text-gray-900">{page}</span>{" "}
                    dari{" "}
                    <span className="font-semibold text-gray-900">
                      {totalPages}
                    </span>
                    <span className="mx-2">•</span>
                    <span>
                      Menampilkan {(page - 1) * limit + 1}-
                      {Math.min(page * limit, total)} dari{" "}
                      <span className="font-semibold text-gray-900">
                        {total}
                      </span>{" "}
                      produk
                    </span>
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProdukComponent;
