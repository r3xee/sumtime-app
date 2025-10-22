import { supabase } from "../lib/supabase/client";
import { CreateProfileService } from "./profile.service";

export const LoginService = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: false,
      message: error.message,
      data: null,
    };
  }

  return {
    status: true,
    message: "Berhasil Login",
    data: data,
  };
};

export const RegisterService = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
      status: false,
      message: error.message,
      data: null,
    };
  }

  // Create profile setelah register berhasil
  if (data.user) {
    await CreateProfileService({
      id: data.user.id,
      email: data.user.email,
    });
  }

  return {
    status: true,
    message: "Berhasil Mendaftarkan Akun Anda",
    data: data,
  };
};

export const LogoutService = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      status: false,
      message: error.message,
    };
  }

  return {
    status: true,
    message: "Berhasil Keluar",
  };
};

export const GoogleLoginService = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    return {
      status: false,
      message: error.message,
    };
  }
  return {
    status: true,
  };
};
