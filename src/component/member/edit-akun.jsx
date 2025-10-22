import { useAuthStore } from "../../store/useAuthStore";

const EditAkun = () => {
  const { profile } = useAuthStore();

  const getAvatarPlaceholder = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <div className="lg:col-span-2">
        <div className="flex items-center gap-7 pb-8 border-b border-gray-300">
          <div className="flex items-center gap-4">
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
          </div>
          <h1 className="font-bold text-gray-500 text-xl">
            {profile?.username}
          </h1>
        </div>
        <div className="mt-5 space-y-7">
          <div className="flex gap-4">
            <button className="bg-[#60B5FF] px-10 text-md py-3 rounded-full text-white">
              Edit Profile
            </button>
            <button className="bg-[#898989] px-10 text-md py-3 rounded-full text-white">
              Password
            </button>
          </div>
          <div className="bg-white shadow-lg inset-shadow-[0px_0px_5px] inset-shadow-gray-200 rounded-2xl p-6 mb-6 border-gray-500">
            <h1 className="text-[#898989] font-bold text-2xl">
              Informasi profile
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAkun;
