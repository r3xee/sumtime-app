import { supabase } from "../lib/supabase/client";

// Get dashboard statistics
export const GetDashboardStatsService = async () => {
  try {
    // Get total produk
    const { count: totalProduk } = await supabase
      .from("produk")
      .select("*", { count: "exact", head: true });

    // Get total orders
    const { count: totalOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    // Get total revenue
    const { data: orders } = await supabase
      .from("orders")
      .select("total_harga")
      .eq("status", "selesai");

    const totalRevenue = orders?.reduce(
      (sum, order) => sum + parseFloat(order.total_harga),
      0
    ) || 0;

    // Get pending orders
    const { count: pendingOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    return {
      status: true,
      data: {
        totalProduk: totalProduk || 0,
        totalOrders: totalOrders || 0,
        totalRevenue,
        pendingOrders: pendingOrders || 0,
      },
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
      data: null,
    };
  }
};

// Get sales chart data (last 7 days)
export const GetSalesChartService = async () => {
  try {
    const today = new Date();
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);

    const { data, error } = await supabase
      .from("orders")
      .select("created_at, total_harga, status")
      .gte("created_at", last7Days.toISOString())
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Initialize all 7 days with 0
    const salesByDate = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateLabel = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
      salesByDate[dateLabel] = 0;
    }

    // Add actual sales data
    data?.forEach((order) => {
      const date = new Date(order.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      });
      if (order.status === "selesai") {
        salesByDate[date] = (salesByDate[date] || 0) + parseFloat(order.total_harga);
      }
    });

    return {
      status: true,
      data: salesByDate,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
      data: null,
    };
  }
};

// Get order status chart data
export const GetOrderStatusChartService = async () => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("status");

    if (error) throw error;

    // Count by status
    const statusCount = {
      pending: 0,
      sedang_dibuat: 0,
      sedang_diantar: 0,
      selesai: 0,
      dibatalkan: 0,
    };

    data?.forEach((order) => {
      if (statusCount[order.status] !== undefined) {
        statusCount[order.status]++;
      }
    });

    return {
      status: true,
      data: statusCount,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
      data: null,
    };
  }
};
