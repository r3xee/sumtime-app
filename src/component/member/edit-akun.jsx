import { useState, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import Profile from "./ui/profile";
import Password from "./ui/password";
import { Camera, Loader2, User, Lock, Info } from "lucide-react";
import { showToast } from "../../store/useToastStore";

const EditAkun = () => {
  const { profile, uploadAvatar, authUser } = useAuthStore();
  const isGoogleUser = authUser?.app_metadata?.provider === "google";
  const [isProfile, setIsProfile] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const getAvatarPlaceholder = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast({
        type: "warning",
        heading: "File tidak valid",
        description: "File harus berupa gambar.",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast({
        type: "warning",
        heading: "File terlalu besar",
        description: "Ukuran file maksimal 2MB.",
      });
      return;
    }

    setIsUploadingAvatar(true);
    const res = await uploadAvatar(file);
    setIsUploadingAvatar(false);

    if (!res.status) {
      showToast({
        type: "error",
        heading: "Gagal mengubah avatar",
        description: res.message || "Terjadi kesalahan saat mengubah avatar.",
      });
      return;
    }

    showToast({
      type: "success",
      heading: "Avatar diperbarui",
      description: "Avatar berhasil diupdate!",
    });
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Header Card with Avatar */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar Section */}
          <div className="relative group">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username || "Avatar"}
                className="w-24 h-24 rounded-2xl object-cover shadow-lg ring-4 ring-white"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg ring-4 ring-white">
                <span className="text-4xl font-bold text-white">
                  {getAvatarPlaceholder(profile?.username)}
                </span>
              </div>
            )}
            
            {/* Edit Avatar Button */}
            <button
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar || isGoogleUser}
              className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-110 duration-300"
              title={isGoogleUser ? "Avatar diatur dari akun Google" : "Edit Avatar"}
            >
              {isUploadingAvatar ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Camera size={16} />
              )}
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              disabled={isGoogleUser}
            />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {profile?.username}
            </h1>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Camera size={14} />
              Klik ikon kamera untuk mengubah avatar
            </p>
            {isGoogleUser && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-200">
                <Info size={12} />
                <span>Login dengan Google</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setIsProfile(true)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300
              ${isProfile
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
              }
            `}
          >
            <User size={18} />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => !isGoogleUser && setIsProfile(false)}
            disabled={isGoogleUser}
            className={`
              flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300
              ${!isProfile
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
              }
              ${isGoogleUser ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <Lock size={18} />
            <span>Password</span>
          </button>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
          <div className="flex items-center gap-3 text-white">
            {isProfile ? (
              <>
                <div className="p-2 bg-white/20 rounded-lg">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Informasi Profile</h2>
                  <p className="text-sm text-blue-100 mt-0.5">
                    Kelola informasi personal Anda
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Lock size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Keamanan Password</h2>
                  <p className="text-sm text-blue-100 mt-0.5">
                    Ubah password untuk keamanan akun
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-8">
          <div className="animate-fadeIn">
            {isProfile ? <Profile /> : <Password />}
          </div>
        </div>
      </div>

      {/* Help Card */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Info size={20} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Butuh Bantuan?
            </h3>
            <p className="text-sm text-gray-600">
              Pastikan informasi yang Anda masukkan sudah benar. 
              {isGoogleUser && " Beberapa fitur dibatasi untuk akun Google."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAkun;