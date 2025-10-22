import { Outlet, useNavigate } from "react-router";
import { ShoppingCart, CircleUserRound, User } from "lucide-react";
import { useEffect, useState } from "react";

const MemberLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[url('../background.png')] bg-repeat-y bg-center relative">
      <div className="absolute inset-0 z-0 bg-white opacity-70"></div>
      {/* Navbar */}
      <nav
        className={`fixed top-0 flex items-center justify-between px-8 lg:px-20 py-5 w-full z-10 h-16 transition-all duration-300 ease-initial ${
          isScrolled ? "bg-white shadow-xl" : ""
        }`}
      >
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/Logoo.png"
            alt="Logo"
            className="h-12 lg:h-20 w-auto max-w-full object-contain cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        {/* Menu */}
        <ul className="hidden md:flex gap-6">
          <a
            href="/"
            className="text-[#898989] hover:text-blue-500 transition font-bold"
          >
            <li>Beranda</li>
          </a>
          <a
            href="/#benefit"
            className="text-[#898989] hover:text-blue-500 transition font-bold"
          >
            <li>Benefit</li>
          </a>
          <a
            href="/product"
            className="text-[#898989] hover:text-blue-500 transition font-bold"
          >
            <li>Produk</li>
          </a>
          <a
            href="/#kontak"
            className="text-[#898989] hover:text-blue-500 transition font-bold"
          >
            <li>Kontak Kami</li>
          </a>
        </ul>

        {/* Icons */}
        <div className="flex gap-5">
          <ShoppingCart className="cursor-pointer hover:text-blue-500 transition" />
          <CircleUserRound
            className="cursor-pointer hover:text-blue-500 transition"
            onClick={() => navigate("/member")}
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 space-y-2">
                <button
                  onClick={() => navigate("/member")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-100 text-blue-600 font-medium"
                >
                  <User size={20} />
                  <span>Informasi Akun</span>
                </button>
                <button
                  onClick={() => navigate("/member/riwayat-pemesanan")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Riwayat Pemesanan</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Keluar Dari Akun</span>
                </button>
              </div>
            </div>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberLayout;
