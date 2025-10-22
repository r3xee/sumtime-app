import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";

const Dashboard = () => {
  const { profile } = useAuthStore();

  // Generate avatar placeholder jika tidak ada avatar_url
  const getAvatarPlaceholder = (name) => {
    if (!name) return "A";
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Welcome Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <p className="text-gray-700">
          Selamat Datang di halaman Dashboard Admin SumTime!
        </p>
      </div>

      {/* Profile Info Card */}
      <div className="bg-gray-100 rounded-lg p-6 flex items-center gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.username || "Avatar"}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {getAvatarPlaceholder(profile?.username)}
              </span>
            </div>
          )}
        </div>

        {/* Profile Details */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {profile?.username || "Admin"}
          </h2>
          <p className="text-gray-600 mb-3">{profile?.email || "-"}</p>
          <p className="text-gray-700">
            Bergabung: {formatDate(profile?.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
