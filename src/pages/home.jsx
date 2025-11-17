import Navbar from "../component/ui/navbar";
import About from "../component/landing-pages/about";
import HomeComponent from "../component/landing-pages/home";
import Footer from "../component/ui/footer";
import FeaturedProducts from "../component/landing-pages/FeaturedProducts";
import { useEffect } from "react";
import { useLocation } from "react-router";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.target) {
      const el = document.getElementById(location.state.target);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location.state]);

  return (
    <>
      <Navbar />
      <div id="beranda" className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="../background.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/75 to-white" />
        </div>
        <div className="relative z-10 pb-10">
          <div id="home">
            <HomeComponent />
          </div>
          <div id="benefit">
            <About />
          </div>
        </div>
      </div>
      <div id="produk" className="pb-20">
        <FeaturedProducts />
      </div>
      <div id="kontak" className="pt-20">
        <Footer />
      </div>
    </>
  );
};

export default Home;
