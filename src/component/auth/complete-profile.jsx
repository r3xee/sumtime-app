import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Loader2, X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { UpdateProfileService } from "../../service/profile.service";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { authUser, profile, refreshProfile } = useAuthStore();

  const [formData, setFormData] = useState({
    username: "",
    no_hp: "",
    bio: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);

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
      setErrors("Harap isi username");
      return;
    }

    // if (!formData.no_hp) {
    //   setErrors("Harap isi nomor HP");
    //   return;
    // }

    setIsLoading(true);

    console.log("authUSer", authUser);

    const res = await UpdateProfileService({
      id: authUser.id,
      username: formData.username,
      no_hp: formData.no_hp,
      bio: formData.bio,
    });

    if (!res.status) {
      setErrors(res.message);
      setIsLoading(false);
      console.error(res.message);
      return;
    }

    // Refresh profile data
    await refreshProfile();

    alert("Profile berhasil dilengkapi!");
    setIsLoading(false);

    // Redirect based on role
    if (profile?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/member");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('../background.png')] bg-repeat-y bg-center relative">
      <div className="absolute inset-0 bg-[#83C1F8]/35 z-0"></div>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm z-20">
        <div className="w-full flex justify-center items-center">
          <div className="relative flex justify-center items-center w-[300px] h-[112px]">
            <img
              src="/logo2.png"
              className="absolute object-contain"
              alt="SumTimes"
            />
          </div>
        </div>

        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Lengkapi Profil Anda
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Silakan lengkapi informasi profil Anda untuk melanjutkan
          </p>
        </div>

        {errors && (
          <div className="text-red-600 p-3 flex items-center flex-col justify-center w-full bg-red-200 rounded-md">
            <button
              onClick={() => setErrors(null)}
              className="w-full flex justify-end text-sm -mt-2 ml-3"
            >
              <X
                size={15}
                className="transition-all hover:scale-110 hover:text-red-700"
              />
            </button>
            <p className="pb-2 text-md">{errors}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Masukkan username Anda"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 placeholder:text-sm placeholder:text-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="no_hp"
                className="block text-sm font-medium text-gray-700"
              >
                Nomor HP <span className="text-red-500">*</span>
              </label>
              <input
                id="no_hp"
                name="no_hp"
                type="tel"
                value={formData.no_hp}
                onChange={handleChange}
                placeholder="Contoh: 081234567890"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 placeholder:text-sm placeholder:text-gray-500"
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio (Opsional)
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Ceritakan sedikit tentang diri Anda..."
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 placeholder:text-sm placeholder:text-gray-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${
              isLoading
                ? "bg-blue-950"
                : "bg-[#293C80] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            } w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 mt-0.5 animate-spin" /> Memuat
              </>
            ) : (
              "Simpan & Lanjutkan"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
