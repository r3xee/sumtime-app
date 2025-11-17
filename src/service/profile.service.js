import { supabase } from "../lib/supabase/client";
import { adminAuthClient } from "../lib/supabase/admin";
import { environment } from "../config/environment";

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
export const UpdateProfileService = async (id, updateData) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updateData)
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

// Update profile dengan email (termasuk update auth.users)
export const UpdateProfileWithEmailService = async ({
  id,
  nama_lengkap,
  username,
  no_hp,
  bio,
  email,
}) => {
  try {
    // Update email di auth.users jika email berubah
    if (email) {
      const { error: authError } =
        await adminAuthClient.auth.admin.updateUserById(id, {
          email,
        });

      if (authError) {
        return {
          status: false,
          message: "Gagal update email di auth: " + authError.message,
          data: null,
        };
      }
    }

    // Update profile di table profiles
    const updateData = {};
    if (nama_lengkap) updateData.username = nama_lengkap;
    if (username) updateData.username = username;
    if (no_hp) updateData.no_hp = no_hp;
    if (bio) updateData.bio = bio;
    if (email) updateData.email = email;

    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
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
  } catch (err) {
    return {
      status: false,
      message: err.message,
      data: null,
    };
  }
};

// Update avatar
export const UpdateAvatarService = async ({ id, avatar_url }) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ avatar_url })
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
    message: "Avatar berhasil diupdate",
    data: data,
  };
};

// Upload avatar ke storage
export const UploadAvatarService = async (
  file,
  userId,
  oldAvatarUrl = null
) => {
  if (oldAvatarUrl) {
    const oldPath = oldAvatarUrl.replace(
      `${environment.SUPABASE_URL}/storage/v1/object/public/sumtime-bucket/`,
      ""
    );
    await supabase.storage.from("sumtime-bucket").remove([oldPath]);
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `images/avatar/${fileName}`;

  // Upload file ke storage
  const { error: uploadError } = await supabase.storage
    .from("sumtime-bucket")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
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
    message: "Avatar berhasil diupload",
    data: {
      path: filePath,
      url: publicUrl,
    },
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
