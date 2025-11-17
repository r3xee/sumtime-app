import Navbar from "../component/ui/navbar";
import Footer from "../component/ui/footer";
import ProdukDetailPage from "../component/landing-pages/produk-detail";

const DetailProdukPages = () => {
  return (
    <>
      <Navbar />
      <div className="py-20">
        <ProdukDetailPage />
      </div>
      <Footer />
    </>
  );
};

export default DetailProdukPages;
