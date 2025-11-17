import { supabase } from "../lib/supabase/client";

// Create order from keranjang
export const CreateOrderService = async (orderData) => {
  try {
    const { userId, alamatPengiriman, catatan, items } = orderData;

    // Calculate total
    const totalHarga = items.reduce(
      (sum, item) => sum + item.produk.harga * item.jumlah,
      0
    );

    // 1. Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          total_harga: totalHarga,
          status: "pending",
          alamat_pengiriman: alamatPengiriman,
          catatan: catatan,
          order_code: crypto.randomUUID().slice(0, 8)
        },
      ])
      .select()
      .single();

    if (orderError) {
      return {
        status: false,
        message: orderError.message,
        data: null,
      };
    }

    // 2. Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      produk_id: item.produk_id,
      nama_produk: item.produk.nama,
      harga: item.produk.harga,
      jumlah: item.jumlah,
      subtotal: item.produk.harga * item.jumlah,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      // Rollback order if items insert fails
      await supabase.from("orders").delete().eq("id", order.id);
      return {
        status: false,
        message: itemsError.message,
        data: null,
      };
    }

    // 3. Clear keranjang
    const { error: clearError } = await supabase
      .from("keranjang")
      .delete()
      .eq("user_id", userId);

    if (clearError) {
      console.error("Failed to clear cart:", clearError);
    }

    // 4. Update stok produk
    for (const item of items) {
      const newStok = item.produk.stok - item.jumlah;
      await supabase
        .from("produk")
        .update({ stok: newStok })
        .eq("id", item.produk_id);
    }

    return {
      status: true,
      message: "Order berhasil dibuat",
      data: order,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
      data: null,
    };
  }
};

// Get orders by user (untuk riwayat transaksi)
export const GetOrdersByUserService = async (
  userId,
  { page = 1, limit = 10, search = "", status = "" }
) => {
  try {
    let query = supabase
      .from("orders")
      .select(
        `
        *,
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
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    // Filter by status
    if (status && status.trim()) {
      query = query.eq("status", status);
    }

    // Search by order ID atau nama produk
    const trimmedSearch = search.trim();
    if (trimmedSearch) {
    query = query.or(
      `order_code.ilike.%${trimmedSearch}%, order_items.nama_produk.ilike.%${trimmedSearch}%`
    );
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
      message: "Berhasil mengambil riwayat order",
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

// Get order by ID (untuk detail transaksi)
export const GetOrderByIdService = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
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
      .eq("id", orderId)
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
      message: "Order ditemukan",
      data: data,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
      data: null,
    };
  }
};
