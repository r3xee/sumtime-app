import { create } from "zustand";
import {
  LoginService,
  RegisterService,
  LogoutService,
  GoogleLoginService,
  UpdatePasswordService,
} from "../service/auth.service";
import {
  GetProfileByEmailService,
  CheckProfileCompleteService,
  CreateProfileService,
  UpdateProfileWithEmailService,
  UploadAvatarService,
  UpdateAvatarService,
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
      if (typeof window !== "undefined") {
        const hash = window.location.hash;
        if (hash && hash.includes("access_token")) {
          const params = new URLSearchParams(hash.substring(1));
          const access_token = params.get("access_token");
          const refresh_token = params.get("refresh_token");

          console.log("[checkAuth] parsed tokens", {
            hasAccessToken: !!access_token,
            hasRefreshToken: !!refresh_token,
          });

          if (access_token && refresh_token) {
            const { data: setSessionData, error: setSessionError } =
              await supabase.auth.setSession({
                access_token,
                refresh_token,
              });

            if (setSessionError) {
              console.error("Set session error:", setSessionError);
            } else {
              console.log("[checkAuth] setSession success", setSessionData);
            }

            window.location.hash = "";
          }
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("[checkAuth] session from getSession", session);

      if (session?.user) {
        const isGoogleUser =
          session.user.app_metadata?.provider === "google";

        const fullName =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          "User";
        const avatarUrl =
          session.user.user_metadata?.avatar_url ||
          session.user.user_metadata?.picture ||
          null;

        // Get profile data
        let profileRes = await GetProfileByEmailService(session.user.email);

        // Jika profile tidak ada (misal user baru), buat profile dengan data dasar
        if (!profileRes.status) {
          const createRes = await CreateProfileService({
            id: session.user.id,
            email: session.user.email,
            username: isGoogleUser ? fullName : undefined,
            avatar_url: isGoogleUser ? avatarUrl : undefined,
          });
          profileRes = createRes;
        } else if (profileRes.status && isGoogleUser) {
          // Untuk user Google lama: lengkapi username/avatar dari user_metadata jika belum ada
          const currentProfile = profileRes.data;
          const needsUsername = !currentProfile.username && fullName;
          const needsAvatar = !currentProfile.avatar_url && avatarUrl;

          if (needsUsername || needsAvatar) {
            const updateRes = await UpdateProfileWithEmailService({
              id: currentProfile.id,
              username: needsUsername ? fullName : undefined,
              avatar_url: needsAvatar ? avatarUrl : undefined,
            });

            if (updateRes.status) {
              profileRes = updateRes;
            }
          }
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

  // Update profile dengan email
  updateProfile: async (payload) => {
    const { authUser } = get();
    if (!authUser) {
      return {
        status: false,
        message: "User tidak ditemukan",
      };
    }

    try {
      const res = await UpdateProfileWithEmailService({
        id: authUser.id,
        ...payload,
      });

      if (!res.status) {
        return res;
      }

      // Update state profile dan authUser jika email berubah
      set({ profile: res.data });

      if (payload.email && payload.email !== authUser.email) {
        // Refresh auth user
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          set({ authUser: session.user });
        }
      }

      return res;
    } catch (error) {
      console.error("Update profile error:", error);
      return {
        status: false,
        message: error.message,
      };
    }
  },

  // Update password
  updatePassword: async (newPassword) => {
    const { authUser } = get();

    try {
      const id = authUser.id;
      const res = await UpdatePasswordService({ id, newPassword });
      return res;
    } catch (error) {
      console.error("Update password error:", error);
      return {
        status: false,
        message: error.message,
      };
    }
  },

  // Upload dan update avatar
  uploadAvatar: async (file) => {
    const { authUser, profile } = get();
    if (!authUser) {
      return {
        status: false,
        message: "User tidak ditemukan",
      };
    }

    try {
      // Upload file
      const uploadRes = await UploadAvatarService(
        file,
        authUser.id,
        profile?.avatar_url
      );
      if (!uploadRes.status) {
        return uploadRes;
      }

      // Update avatar_url di profile
      const updateRes = await UpdateAvatarService({
        id: authUser.id,
        avatar_url: uploadRes.data.url,
      });

      if (!updateRes.status) {
        return updateRes;
      }

      // Update state
      set({ profile: updateRes.data });

      return {
        status: true,
        message: "Avatar berhasil diupdate",
        data: updateRes.data,
      };
    } catch (error) {
      console.error("Upload avatar error:", error);
      return {
        status: false,
        message: error.message,
      };
    }
  },
}));
