const LoadingSkeleton = () => {
  return (
    <section className="pt-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-12">
          <h1
            className="text-center text-6xl font-bold mb-12 text-blue-400"
            style={{
              textShadow: "2px 2px 0px rgba(59, 130, 246, 0.3)",
              letterSpacing: "0.05em",
            }}
          >
            PRODUK
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="h-[200px] rounded-lg bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>

                <div className="mt-6 mb-6 space-y-3">
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-3/4"></div>

                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-5/6"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between space-x-4 mt-auto">
                  <div className="h-10 flex-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-10 w-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoadingSkeleton;
