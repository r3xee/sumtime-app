import { useState, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import Profile from "./ui/profile";
import Password from "./ui/password";
import { Camera, Loader2 } from "lucide-react";

const EditAkun = () => {
  const { profile, uploadAvatar } = useAuthStore();
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

    // Validasi file
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file maksimal 2MB");
      return;
    }

    setIsUploadingAvatar(true);

    const res = await uploadAvatar(file);

    setIsUploadingAvatar(false);

    if (!res.status) {
      alert(res.message);
      return;
    }

    alert("Avatar berhasil diupdate!");
  };

  return (
    <>
      <div className="lg:col-span-2">
        <div className="flex items-center gap-7 pb-8 border-b border-gray-300">
          <div className="flex items-center gap-4">
            <div className="relative">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username || "Avatar"}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#898989] flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {getAvatarPlaceholder(profile?.username)}
                  </span>
                </div>
              )}
              
              {/* Button Edit Avatar */}
              <button
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                className="absolute -bottom-1 -right-1 bg-[#60B5FF] text-white p-2 rounded-full hover:bg-[#4A9FE5] transition-all shadow-lg disabled:opacity-50"
                title="Edit Avatar"
              >
                {isUploadingAvatar ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Camera size={14} />
                )}
              </button>
              
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-gray-500 text-xl">
              {profile?.username}
            </h1>
            <p className="text-sm text-gray-400 mt-1">Klik ikon kamera untuk mengubah avatar</p>
          </div>
        </div>
        <div className="mt-5 space-y-7">
          <div className="flex gap-4">
            <button
              onClick={() => setIsProfile(true)}
              className={` ${
                isProfile ? "bg-[#60B5FF]" : "bg-[#898989]"
              } px-10 text-md py-3 rounded-full text-white`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setIsProfile(false)}
              className={`${
                isProfile ? "bg-[#898989]" : "bg-[#60B5FF]"
              } px-10 text-md py-3 rounded-full text-white`}
            >
              Password
            </button>
          </div>
          <div className="bg-white shadow-lg inset-shadow-[0px_0px_5px] inset-shadow-gray-200 rounded-2xl p-6 mb-6 border-gray-500">
            <h1 className="text-[#898989] font-bold text-2xl">
              Informasi profile
            </h1>
            <div className="p-4">
              {isProfile ? (
                <>
                  <Profile />
                </>
              ) : (
                <>
                  <Password />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAkun;
