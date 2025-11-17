import { useState, useEffect } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { Loader2, X } from "lucide-react";

const Profile = () => {
  const { profile, updateProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    no_hp: profile?.no_hp || "",
    email: profile?.email || "",
    username: profile?.username || "",
    bio: profile?.bio || "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        no_hp: profile.no_hp || "",
        email: profile.email || "",
        username: profile.username || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

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

    if (!formData.username) {
      setError("Username harus diisi");
      return;
    }

    if (!formData.no_hp) {
      setError("Nomor HP harus diisi");
      return;
    }

    if (!formData.email) {
      setError("Email harus diisi");
      return;
    }

    setIsLoading(true);

    const res = await updateProfile({
      username: formData.username,
      no_hp: formData.no_hp,
      email: formData.email,
      bio: formData.bio,
    });

    setIsLoading(false);

    if (!res.status) {
      setError(res.message);
      return;
    }

    setSuccess("Profile berhasil diupdate!");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <>
      {error && (
        <div className="mb-4 text-red-600 p-3 flex items-center justify-between w-full bg-red-100 rounded-md">
          <p className="text-sm">{error}</p>
          <button onClick={() => setError("")}>
            <X size={15} className="transition-all hover:scale-110 hover:text-red-700" />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 text-green-600 p-3 flex items-center justify-between w-full bg-green-100 rounded-md">
          <p className="text-sm">{success}</p>
          <button onClick={() => setSuccess("")}>
            <X size={15} className="transition-all hover:scale-110 hover:text-green-700" />
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="no_hp"
            className="block text-md font-medium text-[#898989]"
          >
            Nomor Handphone
          </label>
          <input
            id="no_hp"
            name="no_hp"
            type="text"
            value={formData.no_hp}
            onChange={handleChange}
            placeholder="Masukkan No Hp"
            required
            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 placeholder:text-sm placeholder:text-gray-500"
          />
        </div>
        <div>
          <label
            htmlFor="no_hp"
            className="block text-md font-medium text-[#898989]"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Masukkan Email"
            required
            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 placeholder:text-sm placeholder:text-gray-500"
          />
        </div>
        <div>
          <label
            htmlFor="username"
            className="block text-md font-medium text-[#898989]"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Masukkan Username"
            required
            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 placeholder:text-sm placeholder:text-gray-500"
          />
        </div>
        <div>
          <label
            htmlFor="bio"
            className="block text-md font-medium text-[#898989]"
          >
            Bio
          </label>
          <input
            id="bio"
            name="bio"
            type="text"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Masukkan Bio"
            required
            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 placeholder:text-sm placeholder:text-gray-500"
          />
        </div>
      </div>
      <div className="flex justify-end mt-7">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`flex items-center bg-[#60B5FF] text-white px-4 py-2 rounded-md shadow-lg cursor-pointer ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#4A9FE5]"
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

export default Profile;
