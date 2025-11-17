import { supabase } from "../lib/supabase/client";

// Get keranjang by user
export const GetKeranjangByUserService = async (userId) => {
  const { data, error } = await supabase
    .from("keranjang")
    .select(
      `
      *,
      produk:produk_id (
        id,
        nama,
        harga,
        gambar_url,
        stok,
        is_active
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      status: false,
      message: error.message,
      data: null,
    };
  }

  return {
    status: true,
    message: "Berhasil mengambil keranjang",
    data: data,
  };
};

// Add to keranjang
export const AddToKeranjangService = async (userId, produkId, jumlah = 1) => {
  // Check if already in cart
  const { data: existing } = await supabase
    .from("keranjang")
    .select("*")
    .eq("user_id", userId)
    .eq("produk_id", produkId)
    .single();

  if (existing) {
    // Update jumlah
    const { data, error } = await supabase
      .from("keranjang")
      .update({ jumlah: existing.jumlah + jumlah })
      .eq("id", existing.id)
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
      message: "Berhasil menambah jumlah produk",
      data: data,
    };
  } else {
    // Insert new
    const { data, error } = await supabase
      .from("keranjang")
      .insert([
        {
          user_id: userId,
          produk_id: produkId,
          jumlah: jumlah,
        },
      ])
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
      message: "Berhasil menambahkan ke keranjang",
      data: data,
    };
  }
};

// Update jumlah keranjang
export const UpdateKeranjangService = async (id, jumlah) => {
  const { data, error } = await supabase
    .from("keranjang")
    .update({ jumlah })
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
    message: "Berhasil update keranjang",
    data: data,
  };
};

// Delete from keranjang
export const DeleteFromKeranjangService = async (id) => {
  const { error } = await supabase.from("keranjang").delete().eq("id", id);

  if (error) {
    return {
      status: false,
      message: error.message,
    };
  }

  return {
    status: true,
    message: "Berhasil menghapus dari keranjang",
  };
};

// Clear keranjang by user
export const ClearKeranjangService = async (userId) => {
  const { error } = await supabase
    .from("keranjang")
    .delete()
    .eq("user_id", userId);

  if (error) {
    return {
      status: false,
      message: error.message,
    };
  }

  return {
    status: true,
    message: "Berhasil mengosongkan keranjang",
  };
};

// Get total items in cart
export const GetKeranjangCountService = async (userId) => {
  const { count, error } = await supabase
    .from("keranjang")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    return {
      status: false,
      message: error.message,
      count: 0,
    };
  }

  return {
    status: true,
    message: "Berhasil mengambil jumlah keranjang",
    count: count || 0,
  };
};
