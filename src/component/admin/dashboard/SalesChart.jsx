import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const SalesChart = ({ data }) => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Penjualan",
        data: [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 4,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      colors: ["#3B82F6"],
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return "Rp " + value.toLocaleString("id-ID");
          },
          style: {
            fontSize: "12px",
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return "Rp " + value.toLocaleString("id-ID");
          },
        },
      },
      grid: {
        borderColor: "#f1f1f1",
      },
    },
  });

  useEffect(() => {
    if (data) {
      const categories = Object.keys(data);
      const values = Object.values(data);

      setChartData((prev) => ({
        ...prev,
        series: [
          {
            name: "Penjualan",
            data: values,
          },
        ],
        options: {
          ...prev.options,
          xaxis: {
            ...prev.options.xaxis,
            categories: categories,
          },
        },
      }));
    }
  }, [data]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Grafik Penjualan (7 Hari Terakhir)
      </h3>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default SalesChart;
