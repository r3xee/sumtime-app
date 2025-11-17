import { Outlet, useNavigate, useLocation } from "react-router";
import { ADMIN_MENU_ITEMS } from "../constants/dashboard.constant";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Icon only on mobile, full width on desktop */}
      <aside className="w-20 lg:w-64 bg-white border-r border-gray-200 fixed lg:fixed h-full overflow-y-auto z-40">

        {/* Logo */}
        <div className="w-full flex justify-center items-center border-b border-gray-200 py-4 lg:py-6">
          <div className="hidden lg:block relative flex justify-center items-center w-[160px] h-[80px]">
            <img
              src="/logo2.png"
              className="absolute object-contain"
              alt="SumTimes"
            />
          </div>
          <div className="lg:hidden text-xl font-bold text-blue-600">ST</div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {ADMIN_MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 rounded-lg transition-all ${
                  active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                title={item.label}
              >
                <Icon size={20} />
                <span className="font-medium hidden lg:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 lg:ml-64 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
