import { Truck, UtensilsCrossed, Receipt, Sparkles } from "lucide-react";

const Benefit = () => {
  const benefits = [
    {
      icon: <Truck className="w-16 h-16 mx-auto mb-4" strokeWidth={1.5} />,
      title: "Pelayanan & Pengiriman Cepat",
    },
    {
      icon: (
        <UtensilsCrossed className="w-16 h-16 mx-auto mb-4" strokeWidth={1.5} />
      ),
      title: "Menggunakan Daging Pilihan yang Fresh",
    },
    {
      icon: <Receipt className="w-16 h-16 mx-auto mb-4" strokeWidth={1.5} />,
      title: "Harga Bersahabat, & Banyak Diskon",
    },
    {
      icon: <Sparkles className="w-16 h-16 mx-auto mb-4" strokeWidth={1.5} />,
      title: "Porsi Pas, Murah, & Kualitas Premium",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1
        className="text-center text-6xl font-bold mb-12 text-blue-400"
        style={{
          textShadow: "2px 2px 0px rgba(59, 130, 246, 0.3)",
          letterSpacing: "0.05em",
        }}
      >
        Benefit
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="border-4 border-blue-400 rounded-3xl p-8 text-center bg-white hover:shadow-lg transition-shadow duration-300"
          >
            <div className="text-blue-400">{benefit.icon}</div>
            <h3 className="text-blue-500 font-bold text-lg leading-tight">
              {benefit.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefit;
