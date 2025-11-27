import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { showToast } from "../../../store/useToastStore";
import {
  CreateAdminUserService,
  UpdateAdminUserService,
} from "../../../service/user.service";

const UserForm = ({ data, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    no_hp: "",
    bio: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        username: data.username || "",
        email: data.email || "",
        password: "",
        no_hp: data.no_hp || "",
        bio: data.bio || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username) {
      showToast({
        type: "warning",
        heading: "Validasi",
        description: "Username harus diisi.",
      });
      return;
    }

    if (!formData.email) {
      showToast({
        type: "warning",
        heading: "Validasi",
        description: "Email harus diisi.",
      });
      return;
    }

    if (!data && !formData.password) {
      showToast({
        type: "warning",
        heading: "Validasi",
        description: "Password harus diisi untuk admin baru.",
      });
      return;
    }

    if (!data && formData.password.length < 6) {
      showToast({
        type: "warning",
        heading: "Validasi",
        description: "Password minimal 6 karakter.",
      });
      return;
    }

    setLoading(true);

    let res;
    if (data) {
      // Update
      const payload = {
        username: formData.username,
        no_hp: formData.no_hp,
        bio: formData.bio,
      };
      res = await UpdateAdminUserService(data.id, payload);
    } else {
      // Create
      res = await CreateAdminUserService({
        email: formData.email,
        password: formData.password,
        username: formData.username,
      });
    }

    setLoading(false);

    if (!res.status) {
      showToast({
        type: "error",
        heading: "Gagal menyimpan admin",
        description: res.message || "Terjadi kesalahan saat menyimpan data.",
      });
      return;
    }

    showToast({
      type: "success",
      heading: data ? "Admin diupdate" : "Admin ditambahkan",
      description: data
        ? "Data admin berhasil diupdate."
        : "Admin baru berhasil ditambahkan.",
    });
    onClose(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {data ? "Edit Admin" : "Tambah Admin"}
          </h1>
          <p className="text-gray-600 mt-1">
            {data ? "Update data admin" : "Tambahkan admin baru"}
          </p>
        </div>
        <button
          onClick={() => onClose(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-gray-200 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Masukkan username"
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
              placeholder="Masukkan email"
              required
              disabled={!!data}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {data && (
              <p className="text-xs text-gray-500 mt-1">
                Email tidak dapat diubah
              </p>
            )}
          </div>

          {/* Password (hanya untuk create) */}
          {!data && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
            </div>
          )}

          {/* No HP */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              No HP
            </label>
            <input
              type="text"
              name="no_hp"
              value={formData.no_hp}
              onChange={handleChange}
              placeholder="Masukkan nomor HP"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Masukkan bio"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
