import { supabase } from "../lib/supabase/client";

// Create profile saat register
export const CreateProfileService = async ({ id, email }) => {
  const { data, error } = await supabase
    .from("profiles")
    .insert([{ id, email }])
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
    message: "Profile berhasil dibuat",
    data: data,
  };
};

// Get profile by email
export const GetProfileByEmailService = async (email) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
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
    message: "Profile ditemukan",
    data: data,
  };
};

// Get profile by ID
export const GetProfileByIdService = async (id) => {
  const { data, error } = await supabase
    .from("profiles")
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
    message: "Profile ditemukan",
    data: data,
  };
};

// Update profile (complete profile)
export const UpdateProfileService = async ({ id, username, no_hp, bio }) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ username, no_hp, bio })
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
    message: "Profile berhasil diupdate",
    data: data,
  };
};

// Check if profile is complete
export const CheckProfileCompleteService = async (id) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("username, no_hp")
    .eq("id", id)
    .single();

  if (error) {
    return {
      status: false,
      message: error.message,
      isComplete: false,
    };
  }

  // Profile dianggap complete jika username dan no_hp sudah diisi
  const isComplete = data.username && data.no_hp;

  return {
    status: true,
    isComplete: isComplete,
    data: data,
  };
};
