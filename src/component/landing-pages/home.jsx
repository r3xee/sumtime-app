import { Link } from "react-router";

const HomeComponent = () => {
  return (
    <>
      <section className="w-full min-h-screen flex justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-poppins  text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight bg-gradient-to-r from-blue-900 via-blue-300 to-blue-900 bg-clip-text text-transparent ">
            Selamat Datang <br />
            di Surga Dimsum
          </h1>
          <p className="font-poppins font-semibold mt-4 text-sm sm:text-base md:text-lg text-blue-300">
            Di sini, setiap gigitan dimsum adalah perjalanan rasa lembut, gurih,{" "}
            <br />
            dan bikin rindu. Siap untuk mencicipinya?
          </p>
          <Link
            to="/product"
            className="flex w-75 h-13 mt-5 text-white bg-blue-500 justify-center items-center rounded-2xl hover:bg-blue-700 hover:-translate-0.5 hover:shadow-2xl transition"
          >
            Lihat menu
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomeComponent;
