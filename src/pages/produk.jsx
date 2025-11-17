import Navbar from "../component/ui/navbar";
import ProdukComponent from "../component/landing-pages/produk";
import Footer from "../component/ui/footer";

const ProdukPages = () => {
  return (
    <>
      <Navbar />
      <div className="py-10">
        <ProdukComponent />
      </div>
      <Footer />
    </>
  );
};

export default ProdukPages;
