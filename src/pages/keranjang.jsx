import Navbar from "../component/ui/navbar";
import Footer from "../component/ui/footer";
import KeranjangComponent from "../component/landing-pages/keranjang";
import { useEffect } from "react";

const KeranjangPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="py-20">
        <KeranjangComponent />
      </div>
      <Footer />
    </>
  );
};

export default KeranjangPage;
