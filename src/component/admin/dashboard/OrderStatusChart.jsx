import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const OrderStatusChart = ({ data }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "donut",
        height: 350,
      },
      labels: ["Pending", "Sedang Dibuat", "Sedang Diantar", "Selesai", "Dibatalkan"],
      colors: ["#F59E0B", "#3B82F6", "#8B5CF6", "#10B981", "#EF4444"],
      legend: {
        position: "bottom",
        fontSize: "14px",
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toFixed(0) + "%";
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            labels: {
              show: true,
              total: {
                show: true,
                label: "Total Pesanan",
                fontSize: "16px",
                fontWeight: 600,
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                },
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300,
            },
            legend: {
              position: "bottom",
              fontSize: "12px",
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    if (data) {
      const values = [
        data.pending || 0,
        data.sedang_dibuat || 0,
        data.sedang_diantar || 0,
        data.selesai || 0,
        data.dibatalkan || 0,
      ];

      setChartData((prev) => ({
        ...prev,
        series: values,
      }));
    }
  }, [data]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Status Pesanan
      </h3>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="donut"
        height={350}
      />
    </div>
  );
};

export default OrderStatusChart;
