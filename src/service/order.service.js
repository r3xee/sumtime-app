import { supabase } from "../lib/supabase/client";

// Get all orders dengan pagination dan search
export const GetAllOrdersServiceMember  = async (userId, {
  page = 1,
  limit = 10,
  search = "",
  status = ""
}) => {
  try {
    let query = supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          nama_produk,
          jumlah,
          harga,
          subtotal
        )
      `,
        { count: "exact" }
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    // SEARCH
    if (search) {
      console.log("search", search)
      query = query.ilike("order_code", `%${search}%`);
    }

    // FILTER STATUS
    if (status) {
      query = query.eq("status", status);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return { status: false, message: error.message, data: [], total: 0 };
    }

    return {
      status: true,
      data,
      total: count,
      totalPages: Math.ceil(count / limit),
    };
  } catch (e) {
    return { status: false, message: e.message, data: [], total: 0 };
  }
};

export const GetAllOrdersService = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
}) => {
  try {
    let query = supabase
      .from("orders")
      .select(
        `
        *,
        profiles:user_id (
          id,
          username,
          email,
          avatar_url,
          no_hp
        ),
        order_items (
          id,
          nama_produk,
          harga,
          jumlah,
          subtotal
        )
      `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    // Search by user email atau username
    if (search) {
      const orderCodeQuery = query.ilike("order_code", `%${search}%`);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id")
        .or(`username.ilike.%${search}%,email.ilike.%${search}%`);

      if (profileData?.length > 0) {
        const userIds = profileData.map((p) => p.id);
        query = query.or(
          `order_code.ilike.%${search}%,user_id.in.(${userIds.join(",")})`
        );
      } else {
        query = orderCodeQuery;
      }
    }


    // Filter by status
    if (status) {
      query = query.eq("status", status);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return {
        status: false,
        message: error.message,
        data: null,
        total: 0,
      };
    }

    return {
      status: true,
      message: "Berhasil mengambil data order",
      data: data,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
      data: null,
      total: 0,
    };
  }
};

// Get order by ID
export const GetOrderByIdService = async (id) => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      profiles:user_id (
        id,
        username,
        email,
        no_hp,
        avatar_url
      ),
      order_items (
        id,
        produk_id,
        nama_produk,
        harga,
        jumlah,
        subtotal
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return {
      status: false,
      message: error.message,
      data: null,
    };
  }

  return {
    status: true,
    message: "Berhasil mengambil data order",
    data: data,
  };
};

// Update status order
export const UpdateOrderStatusService = async (id, status) => {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      status: false,
      message: error.message,
      data: null,
    };
  }

  return {
    status: true,
    message: "Status order berhasil diupdate",
    data: data,
  };
};

// Get order statistics
export const GetOrderStatsService = async () => {
  try {
    // Total orders
    const { count: totalOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    // Orders by status
    const { data: statusData } = await supabase
      .from("orders")
      .select("status");

    const stats = {
      total: totalOrders || 0,
      pending: statusData?.filter((o) => o.status === "pending").length || 0,
      sedang_dibuat:
        statusData?.filter((o) => o.status === "sedang_dibuat").length || 0,
      sedang_diantar:
        statusData?.filter((o) => o.status === "sedang_diantar").length || 0,
      selesai: statusData?.filter((o) => o.status === "selesai").length || 0,
      dibatalkan:
        statusData?.filter((o) => o.status === "dibatalkan").length || 0,
    };

    return {
      status: true,
      message: "Berhasil mengambil statistik order",
      data: stats,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
      data: null,
    };
  }
};
