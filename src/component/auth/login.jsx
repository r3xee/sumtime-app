import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin, isLoggingIn } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      setErrors("Harap Isi Email");
      return;
    }

    if (!formData.password) {
      setErrors("Harap Isi Password");
      return;
    }

    const insertdata = {
      email: formData.email,
      password: formData.password,
    };

    const res = await login(insertdata);

    if (!res.status) {
      setErrors(res.message);
      return;
    }

    alert("Login berhasil");

    navigate("/");
  };

  const handleGoogleLogin = async () => {
    await googleLogin();
  };

  return (
    <>
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
          <h2 className="mt-6 text-center text-4xl font-bold text-gray-900">
            Masuk Ke SumTimes
          </h2>

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
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="✉ Masukkan Email Anda... *(someone@ub.ac.id)"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 placeholder:text-sm placeholder:text-gray-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="🔒 Masukkan Password Anda..."
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-700 focus:border-blue-700 placeholder:text-sm placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#293C80] border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="/register"
                  className="font-medium text-[#293C80] hover:text-blue-600"
                >
                  Tidak punya akun ?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn ? true : false}
              className={`${
                isLoggingIn
                  ? "bg-blue-950"
                  : "bg-[#293C80] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              } w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white `}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 mt-0.5 animate-spin " />{" "}
                  Memuat
                </>
              ) : (
                "Masuk"
              )}
            </button>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span className="ml-2">Google</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
