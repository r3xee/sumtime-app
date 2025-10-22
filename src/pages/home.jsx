import Navbar from "../component/ui/navbar";
import About from "../component/landing-pages/about";
import HomeComponent from "../component/landing-pages/home";
import Footer from "../component/ui/footer";
import Benefit from "../component/landing-pages/benefit";


const Home = () => {

 

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4x bg-[url('../background.png')] bg-repeat-y bg-center">
        <HomeComponent />
        <About />
        <Benefit />
      </main>
      <Footer />
    </>
  );
};

export default Home;
