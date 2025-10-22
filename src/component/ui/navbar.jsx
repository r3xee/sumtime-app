import { ShoppingCart, CircleUserRound, Menu } from "lucide-react";
import { useEffect, useState } from "react";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 flex items-center justify-center gap-80 py-5 w-full z-20 h-16 transition-all duration-300 ease-initial ${
        isScrolled ? "bg-white shadow-xl" : ""
      }`}
    >
      <div className="flex items-center">
        <img
          src="../public/Logoo.png"
          alt="Logo"
          className="h-15 sm:h-20 md:h-12 lg:h-20 xl:h-20 2xl:h-20 w-auto max-w-full object-contain"
        />
      </div>
      <ul className="hidden md:flex gap-6 place-content-around ">
        <a
          href="#"
          className="text-[#898989] hover:text-blue-500 transition font-bold"
        >
          <li>Beranda</li>
        </a>
        <a
          href="#"
          className="text-[#898989] hover:text-blue-500 transition font-bold"
        >
          <li>Benefit</li>
        </a>
        <a
          href="#"
          className="text-[#898989] hover:text-blue-500 transition font-bold"
        >
          <li>Produk</li>
        </a>
        <a
          href="#"
          className="text-[#898989] hover:text-blue-500 transition font-bold"
        >
          <li>Kontak Kami</li>
        </a>
      </ul>
      <div className="flex gap-5">
        <a href=""></a>
        <ShoppingCart className="cursor-pointer hover:text-blue-500 transition" />
        <a href="">
          <CircleUserRound className="cursor-pointer hover:text-blue-500 transition" />
        </a>
        <Menu className="cursor-pointer hover:text-blue-500 transition md:hidden" />
      </div>
    </div>
  );
}

export default Navbar;
