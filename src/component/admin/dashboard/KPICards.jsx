import { Package, ShoppingCart, DollarSign, Clock } from "lucide-react";

const KPICards = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: "Total Produk",
      value: stats?.totalProduk || 0,
      icon: Package,
      color: "bg-blue-500",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total Pesanan",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-green-500",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Pendapatan",
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: "bg-purple-500",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Pesanan Pending",
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: "bg-orange-500",
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.bgLight}`}>
                <Icon className={card.textColor} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {card.title}
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;
