import { supabase } from "../lib/supabase/client";

// Get all produk dengan pagination dan search
export const GetAllProdukService = async ({
  page = 1,
  limit = 10,
  search = "",
  isActive = true,
}) => {
  try {
    let query = supabase
      .from("produk")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    // Search by nama atau deskripsi
    if (search) {
      query = query.or(`nama.ilike.%${search}%,deskripsi.ilike.%${search}%`);
    }

    // Filter by active status
    if (isActive !== undefined) {
      query = query.eq("is_active", isActive);
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
      message: "Berhasil mengambil data produk",
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

// Get produk by ID
export const GetProdukByIdService = async (id) => {
  const { data, error } = await supabase
    .from("produk")
    .select("*")
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
    message: "Berhasil mengambil data produk",
    data: data,
  };
};

// Create produk
export const CreateProdukService = async (produkData) => {
  const { data, error } = await supabase
    .from("produk")
    .insert([produkData])
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
    message: "Produk berhasil ditambahkan",
    data: data,
  };
};

// Update produk
export const UpdateProdukService = async (id, produkData) => {
  const { data, error } = await supabase
    .from("produk")
    .update(produkData)
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
    message: "Produk berhasil diupdate",
    data: data,
  };
};

// Delete produk
export const DeleteProdukService = async (id) => {
  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    return {
      status: false,
      message: error.message,
    };
  }

  return {
    status: true,
    message: "Produk berhasil dihapus",
  };
};

// Upload gambar produk ke storage
export const UploadGambarProdukService = async (file) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `images/produk/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("sumtime-bucket")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return {
      status: false,
      message: uploadError.message,
      data: null,
    };
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("sumtime-bucket").getPublicUrl(filePath);

  return {
    status: true,
    message: "Gambar berhasil diupload",
    data: {
      path: filePath,
      url: publicUrl,
    },
  };
};

// Get random produk (untuk landing page)
export const GetRandomProdukService = async (limit = 3) => {
  const { data, error } = await supabase
    .from("produk")
    .select("*")
    .eq("is_active", true)
    .limit(100); // Get 100 first then random

  if (error) {
    return {
      status: false,
      message: error.message,
      data: [],
    };
  }

  // Shuffle and take limit
  const shuffled = data.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, limit);

  return {
    status: true,
    message: "Berhasil mengambil produk random",
    data: selected,
  };
};
