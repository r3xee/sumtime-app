import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Loader2, Eye, EyeOff, Upload, X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { UpdateAvatarService } from "../../service/profile.service";
import { supabase } from "../../lib/supabase/client";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, authUser } = useAuthStore();
  const isGoogleUser = authUser?.app_metadata?.provider === "google";
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    no_hp: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        nama_lengkap: profile.nama_lengkap || profile.username || "",
        email: profile.email || "",
        no_hp: profile.no_hp || "",
        bio: profile.bio || "",
      }));
      setAvatarPreview(profile.avatar_url || null);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.nama_lengkap.trim()) {
      setError("Nama lengkap tidak boleh kosong");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email tidak boleh kosong");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Format email tidak valid");
      return false;
    }

    // Password validation
    if (formData.newPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        setError("Masukkan password saat ini untuk mengubah password");
        return false;
      }

      if (!formData.newPassword) {
        setError("Masukkan password baru");
        return false;
      }

      if (formData.newPassword.length < 6) {
        setError("Password baru minimal 6 karakter");
        return false;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError("Password baru dan konfirmasi tidak cocok");
        return false;
      }
    }

    return true;
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5MB");
      return;
    }

    setAvatarFile(file);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = async () => {
    setAvatarFile(null);
    setAvatarPreview(null);

    if (!profile?.id) return;

    try {
      setUploadingAvatar(true);
      const res = await UpdateAvatarService({
        id: profile.id,
        avatar_url: null,
      });
      setUploadingAvatar(false);

      if (!res.status) {
        setError(res.message);
        setAvatarPreview(profile.avatar_url || null);
      }
    } catch (error) {
      setUploadingAvatar(false);
      setError("Gagal menghapus avatar: " + error.message);
      setAvatarPreview(profile.avatar_url || null);
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const { uploadAvatar: uploadAvatarMethod } = useAuthStore.getState();
      const res = await uploadAvatarMethod(file);
      return res;
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Verify current password if changing password
      if (formData.currentPassword) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: profile.email,
          password: formData.currentPassword,
        });

        if (signInError) {
          setError("Password saat ini salah");
          setLoading(false);
          return;
        }

        // 2. Update password di auth
        const { error: updatePasswordError } = await supabase.auth.updateUser({
          password: formData.newPassword,
        });

        if (updatePasswordError) {
          setError("Gagal mengubah password: " + updatePasswordError.message);
          setLoading(false);
          return;
        }
      }

      // 2. Upload avatar jika ada
      if (avatarFile) {
        setUploadingAvatar(true);
        const uploadRes = await uploadAvatar(avatarFile);
        setUploadingAvatar(false);

        if (!uploadRes.status) {
          setError(uploadRes.message);
          setLoading(false);
          return;
        }
      }

      // 3. Update profile (including email if changed)
      const res = await updateProfile({
        nama_lengkap: formData.nama_lengkap,
        email: formData.email,
        no_hp: formData.no_hp,
        bio: formData.bio,
      });

      if (res.status) {
        setSuccess("Profile berhasil diupdate");
        
        // Reset password fields dan avatar
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setAvatarFile(null);

        setTimeout(() => {
          navigate("/admin");
        }, 2000);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Terjadi kesalahan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            <ArrowLeft size={20} />
            <span>Kembali</span>
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600 mt-1">
              Ubah informasi profil dan keamanan akun Anda
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700">{success}</p>
              </div>
            )}

            {/* Avatar Upload */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Foto Profil
              </h2>

              <div className="flex items-center gap-6">
                {/* Avatar Preview */}
                <div className="flex-shrink-0">
                  {avatarPreview ? (
                    <div className="relative">
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No image</span>
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex-1">
                  <label className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                    <Upload size={18} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {avatarFile ? "Ganti Foto" : "Pilih Foto"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={uploadingAvatar || isGoogleUser}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG, GIF (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Informasi Profil */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Informasi Profil
              </h2>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isGoogleUser}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {isGoogleUser
                    ? "Email diatur dari akun Google dan tidak dapat diubah di sini."
                    : "Email akan diperbarui di akun Anda"}
                </p>
              </div>

              {/* No HP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Telepon
                </label>
                <input
                  type="tel"
                  name="no_hp"
                  value={formData.no_hp}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Keamanan */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Keamanan Akun
              </h2>

              <p className="text-sm text-gray-600">
                {isGoogleUser
                  ? "Akun ini login dengan Google. Password tidak dapat diubah di aplikasi ini."
                  : "Biarkan kosong jika tidak ingin mengubah password"}
              </p>

              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Saat Ini
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Masukkan password saat ini"
                    disabled={authUser.app_metadata.provider === 'google'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Masukkan password baru"
                    disabled={isGoogleUser}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Konfirmasi password baru"
                  disabled={isGoogleUser}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium flex items-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={18} />}
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
