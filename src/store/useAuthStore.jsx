import { create } from "zustand";
import {
  LoginService,
  RegisterService,
  LogoutService,
  GoogleLoginService,
} from "../service/auth.service";
import {
  GetProfileByEmailService,
  CheckProfileCompleteService,
  CreateProfileService,
} from "../service/profile.service";
import { supabase } from "../lib/supabase/client";

export const useAuthStore = create((set, get) => ({
  // State
  authUser: null,
  profile: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,

  // Login
  login: async (payload) => {
    set({ isLoggingIn: true });
    try {
      const res = await LoginService(payload);
      if (!res.status) {
        set({ isLoggingIn: false });
        return res;
      }

      // Get profile data
      const profileRes = await GetProfileByEmailService(res.data.user.email);

      set({
        authUser: res.data.user,
        profile: profileRes.data,
        isLoggingIn: false,
      });

      return res;
    } catch (error) {
      console.error("Login error:", error);
      set({ isLoggingIn: false });
      return {
        status: false,
        message: error.message,
      };
    }
  },

  // Register
  register: async (payload) => {
    set({ isSigningUp: true });
    try {
      const res = await RegisterService(payload);
      if (!res.status) {
        set({ isSigningUp: false });
        return res;
      }

      set({
        authUser: res.data.user,
        isSigningUp: false,
      });

      return res;
    } catch (error) {
      console.error("Register error:", error);
      set({ isSigningUp: false });
      return {
        status: false,
        message: error.message,
      };
    }
  },

  // Google Login
  googleLogin: async () => {
    try {
      const res = await GoogleLoginService();
      return res;
    } catch (error) {
      console.error("Google login error:", error);
      return {
        status: false,
        message: error.message,
      };
    }
  },

  // Logout
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      const res = await LogoutService();
      if (!res.status) {
        set({ isLoggingOut: false });
        return res;
      }

      set({
        authUser: null,
        profile: null,
        isLoggingOut: false,
      });

      return res;
    } catch (error) {
      console.error("Logout error:", error);
      set({ isLoggingOut: false });
      return {
        status: false,
        message: error.message,
      };
    }
  },

  // Check Auth (untuk initial load dan OAuth callback)
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Get profile data
        let profileRes = await GetProfileByEmailService(session.user.email);

        // Jika profile tidak ada (OAuth user baru), buat profile
        if (!profileRes.status) {
          const createRes = await CreateProfileService({
            id: session.user.id,
            email: session.user.email,
          });
          profileRes = createRes;
        }

        set({
          authUser: session.user,
          profile: profileRes.data,
          isCheckingAuth: false,
        });
      } else {
        set({
          authUser: null,
          profile: null,
          isCheckingAuth: false,
        });
      }
    } catch (error) {
      console.error("Check auth error:", error);
      set({
        authUser: null,
        profile: null,
        isCheckingAuth: false,
      });
    }
  },

  // Refresh Profile (setelah update profile)
  refreshProfile: async () => {
    const { authUser } = get();
    if (!authUser) return;

    try {
      const profileRes = await GetProfileByEmailService(authUser.email);
      if (profileRes.status) {
        set({ profile: profileRes.data });
      }
    } catch (error) {
      console.error("Refresh profile error:", error);
    }
  },

  // Check if profile is complete
  checkProfileComplete: async () => {
    const { authUser } = get();
    if (!authUser) return false;

    try {
      const res = await CheckProfileCompleteService(authUser.id);
      return res.isComplete;
    } catch (error) {
      console.error("Check profile complete error:", error);
      return false;
    }
  },
}));
