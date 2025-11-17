import { ShoppingCart, CircleUserRound, Menu, X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { GetKeranjangCountService } from "../../service/keranjang.service";

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { authUser, profile } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCartCount = useCallback(async () => {
    if (!authUser) return;
    const res = await GetKeranjangCountService(authUser.id);
    if (res.status) setCartCount(res.count);
  }, [authUser]);

  useEffect(() => {
    if (authUser) fetchCartCount();
    else setCartCount(0);
  }, [authUser, fetchCartCount]);

  useEffect(() => {
    if (!authUser) return;
    const interval = setInterval(fetchCartCount, 2000);
    return () => clearInterval(interval);
  }, [authUser, fetchCartCount]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const goToHomeSection = (target) => {
    if (location.pathname === "/") {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate("/", { state: { target } });
    }
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (!authUser) {
      navigate("/login");
      setIsMobileMenuOpen(false);
      return;
    }

    if (profile?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/member");
    }
    setIsMobileMenuOpen(false);
  };

  const handleProdukClick = () => {
    navigate("/produk");
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="fixed top-0 flex items-center justify-between md:justify-center md:gap-80 px-6 md:px-0 py-5 w-full z-50 h-16 transition-all duration-300 bg-white shadow-lg">
        <div className="flex items-center">
          <img src="../public/Logoo.png" alt="Logo" className="h-20 w-auto" />
        </div>

        <ul className="hidden md:flex gap-6">
          <li>
            <a
              onClick={() => goToHomeSection("home")}
              className="text-[#898989] hover:text-blue-500 font-bold cursor-pointer"
            >
              Beranda
            </a>
          </li>

          <li>
            <a
              onClick={() => goToHomeSection("benefit")}
              className="text-[#898989] hover:text-blue-500 font-bold cursor-pointer"
            >
              Tentang Kami
            </a>
          </li>

          <li>
            <a
              href="/produk"
              className="text-[#898989] hover:text-blue-500 font-bold cursor-pointer"
            >
              Produk
            </a>
          </li>
        </ul>

        <div className="flex gap-5 items-center">
          <div className="relative">
            <ShoppingCart
              onClick={() => navigate("/keranjang")}
              className="cursor-pointer hover:text-blue-500"
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </div>

          <div className="hidden md:block">
            {profile?.avatar_url ? (
              <img
                className="cursor-pointer hover:scale-110 w-8 h-8 rounded-full duration-200"
                onClick={handleProfileClick}
                src={profile.avatar_url}
                alt={profile.username}
              />
            ) : (
              <CircleUserRound
                onClick={handleProfileClick}
                className="cursor-pointer hover:text-blue-500"
              />
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden cursor-pointer hover:text-blue-500 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
          <div className="p-6 border-b border-gray-200">
            <div
              onClick={handleProfileClick}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl cursor-pointer hover:from-blue-100 hover:to-blue-200 transition-all"
            >
              {profile?.avatar_url ? (
                <img
                  className="w-12 h-12 rounded-full border-2 border-blue-300"
                  src={profile.avatar_url}
                  alt={profile.username}
                />
              ) : (
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <CircleUserRound className="text-white" size={24} />
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {authUser ? profile?.username || "User" : "Guest"}
                </p>
                <p className="text-sm text-gray-600">
                  {authUser ? "Lihat Profil" : "Login / Daftar"}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            <a
              onClick={() => goToHomeSection("home")}
              className="flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors cursor-pointer font-semibold"
            >
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              Beranda
            </a>

            <a
              onClick={() => goToHomeSection("benefit")}
              className="flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors cursor-pointer font-semibold"
            >
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              Tentang Kami
            </a>

            <a
              onClick={handleProdukClick}
              className="flex items-center gap-4 px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors cursor-pointer font-semibold"
            >
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              Produk
            </a>

            <a
              onClick={() => {
                navigate("/keranjang");
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors cursor-pointer font-semibold"
            >
              <div className="flex items-center gap-4">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Keranjang
              </div>
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </a>
          </nav>

          <div className="p-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2024 Dimsum Store. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
