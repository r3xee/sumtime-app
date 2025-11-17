import { supabase } from "../lib/supabase/client";
import { AuthClient } from "@supabase/supabase-js";

// Get all admin users dengan pagination dan search
export const GetAllAdminUsersService = async ({
  page = 1,
  limit = 10,
  search = "",
}) => {
  try {
    let query = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .eq("role", "admin")
      .order("created_at", { ascending: false });

    // Search by username atau email
    if (search) {
      query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%`);
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
      message: "Berhasil mengambil data admin",
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

// Get admin user by ID
export const GetAdminUserByIdService = async (id) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "admin")
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
    message: "Berhasil mengambil data admin",
    data: data,
  };
};

// Create admin user (register admin)
export const CreateAdminUserService = async ({ email, password, username }) => {
  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return {
        status: false,
        message: authError.message,
        data: null,
      };
    }

    // 2. Update profile dengan role admin
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .update({
        username,
        role: "admin",
      })
      .eq("id", authData.user.id)
      .select()
      .single();

    if (profileError) {
      return {
        status: false,
        message: profileError.message,
        data: null,
      };
    }

    return {
      status: true,
      message: "Admin berhasil ditambahkan",
      data: profileData,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
      data: null,
    };
  }
};

// Update admin user
export const UpdateAdminUserService = async (id, userData) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(userData)
    .eq("id", id)
    .eq("role", "admin")
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
    message: "Data admin berhasil diupdate",
    data: data,
  };
};

// Delete admin user
export const DeleteAdminUserService = async (id) => {
  try {
    // Delete dari profiles (auth user akan tetap ada)
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id)
      .eq("role", "admin");

    if (error) {
      return {
        status: false,
        message: error.message,
      };
    }

    return {
      status: true,
      message: "Admin berhasil dihapus",
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};

// Get admin statistics
export const GetAdminStatsService = async () => {
  try {
    const { count: totalAdmin } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");

    const { count: totalMember } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "member");

    return {
      status: true,
      message: "Berhasil mengambil statistik user",
      data: {
        totalAdmin: totalAdmin || 0,
        totalMember: totalMember || 0,
        total: (totalAdmin || 0) + (totalMember || 0),
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
