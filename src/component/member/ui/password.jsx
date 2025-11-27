import { useState } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { Loader2, X } from "lucide-react";

const Password = () => {
  const { updatePassword, authUser } = useAuthStore();
  const isGoogleUser = authUser?.app_metadata?.provider === "google";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.password) {
      setError("Password harus diisi");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (!formData.confirm_password) {
      setError("Konfirmasi password harus diisi");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Password dan konfirmasi password tidak sama");
      return;
    }

    setIsLoading(true);

    const res = await updatePassword(formData.password);

    setIsLoading(false);

    if (!res.status) {
      setError(res.message);
      return;
    }

    setSuccess("Password berhasil diubah!");
    setFormData({
      password: "",
      confirm_password: "",
    });
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <>
      {error && (
        <div className="mb-4 text-red-600 p-3 flex items-center justify-between w-full bg-red-100 rounded-md">
          <p className="text-sm">{error}</p>
          <button onClick={() => setError("")}>
            <X
              size={15}
              className="transition-all hover:scale-110 hover:text-red-700"
            />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 text-green-600 p-3 flex items-center justify-between w-full bg-green-100 rounded-md">
          <p className="text-sm">{success}</p>
          <button onClick={() => setSuccess("")}>
            <X
              size={15}
              className="transition-all hover:scale-110 hover:text-green-700"
            />
          </button>
        </div>
      )}

      {isGoogleUser && (
        <div className="mb-4 text-blue-600 p-3 flex items-center justify-between w-full bg-blue-50 rounded-md">
          <p className="text-sm">
            Akun ini login dengan Google. Password tidak dapat diubah di aplikasi ini.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="block text-md font-medium text-[#898989]"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Masukkan Password Baru"
            required
            disabled={isGoogleUser}
            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 placeholder:text-sm placeholder:text-gray-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
        <div>
          <label
            htmlFor="confirm_password"
            className="block text-md font-medium text-[#898989]"
          >
            Konfirmasi Password
          </label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="Masukkan Konfirmasi Password"
            required
            disabled={isGoogleUser}
            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 placeholder:text-sm placeholder:text-gray-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>
      </div>
      <div className="flex justify-end mt-7">
        <button
          onClick={handleSubmit}
          disabled={isLoading || isGoogleUser}
          className={`flex items-center bg-[#60B5FF] text-white px-4 py-2 rounded-md shadow-lg cursor-pointer ${
            isLoading || isGoogleUser
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#4A9FE5]"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 mt-0.5 animate-spin" /> Memuat
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </button>
      </div>
    </>
  );
};

export default Password;
