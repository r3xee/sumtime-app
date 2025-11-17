import Benefit from "./ui/benefit";

function About() {
  return (
    <div className="">
      <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-72 h-72 bg-blue-100 rounded-3xl opacity-60 blur-2xl"></div>

                <img
                  src="/dimsum.jpeg"
                  alt="SumTime Dimsum"
                  className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl object-cover aspect-square"
                />

                <div className="absolute -bottom-4 -right-4 bg-white px-6 py-3 rounded-2xl shadow-lg">
                  <p className="text-sm font-semibold text-gray-700">
                    🥟 Fresh & Delicious
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <div className="space-y-2">
                <div className="inline-block px-4 py-2 bg-blue-50 rounded-full">
                  <p className="text-sm font-semibold text-blue-600">
                    Tentang Kami
                  </p>
                </div>
                <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900">
                  SumTime!
                </h1>
              </div>

              <div className="relative pl-6 border-l-4 border-blue-400">
                <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-light">
                  SumTime! lahir dari proyek akhir KIK. Menggabungkan Teknologi
                  dan Kreativitas untuk menghadirkan dimsum lezat dalam kemasan
                  digital, kami membangun cita rasa dan tampilan dengan sepenuh
                  hati.
                </p>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed">
                Setiap gigitan dimsum ini adalah cerita tentang persahabatan,
                kerja sama, dan mimpi kami.
              </p>
              <p className="text-right text-lg text-gray-600 leading-relaxed">
                Aris, Rosy, Yuni
              </p>

              <div className="">
                <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                  Lihat Menu Kami
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-20 right-10 w-32 h-32 bg-yellow-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-pink-100 rounded-full opacity-30 blur-3xl"></div>
      </section>

      <Benefit />
    </div>
  );
}

export default About;
