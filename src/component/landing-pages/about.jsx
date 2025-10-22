function About() {
  return (
    <>
      <div className="h-200">
        <div className="absolute right-0 top-130 bg-[#AFDDFF] h-95 w-5xl rounded-l-4xl pl-50 pt-4 text-white flex flex-col justify-between">
          <div>
            <h1 className="text-5xl font-extrabold">SumTime!</h1>
            <p className="text-3xl mt-10 text-black font-caveat">
              “ SumTime! lahir dari proyek akhir KIK. Menggabungkan Teknologi
              dan Kreativitas untuk menghadirkan dimsum lezat dalam kemasan
              digital, kami membangun cita rasa dan tampilan dengan sepenuh
              hati. Setiap gigitan dimsum ini adalah cerita tentang
              persahabatan, kerja sama, dan mimpi kami. ”
            </p>
          </div>
          <div>
            <p className="text-2xl text-black font-caveat h-30 mr-50 ">
              -Aris, Rossy, Yuni
            </p>
          </div>
        </div>
        <div className="absolute top-150 ">
          <img
            src="/dimsum.jpeg"
            alt=""
            className="h-115 w-90 rounded-4xl shadow-2xl"
          />
        </div>
      </div>
    </>
  );
}
export default About;
