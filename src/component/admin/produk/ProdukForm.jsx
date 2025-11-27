import { useState, useRef, useEffect } from "react";
import { X, Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { showToast } from "../../../store/useToastStore";
import {
  CreateProdukService,
  UpdateProdukService,
  UploadGambarProdukService,
} from "../../../service/produk.service";

const ProdukForm = ({ data, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    harga: "",
    stok: "",
    penyajian: "",
    gambar_url: "",
    is_active: true,
  });
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      setFormData({
        nama: data.nama || "",
        deskripsi: data.deskripsi || "",
        harga: data.harga || "",
        stok: data.stok || "",
        penyajian: data.penyajian || "",
        gambar_url: data.gambar_url || "",
        is_active: data.is_active ?? true,
      });
      setImagePreview(data.gambar_url || "");
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast({
        type: "warning",
        heading: "File tidak valid",
        description: "File harus berupa gambar.",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast({
        type: "warning",
        heading: "File terlalu besar",
        description: "Ukuran file maksimal 2MB.",
      });
      return;
    }

    setUploadingImage(true);

    const res = await UploadGambarProdukService(file);

    setUploadingImage(false);

    if (!res.status) {
      showToast({
        type: "error",
        heading: "Gagal upload gambar",
        description: res.message || "Terjadi kesalahan saat upload gambar.",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      gambar_url: res.data.url,
    }));
    setImagePreview(res.data.url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama) {
      showToast({
        type: "warning",
        heading: "Validasi",
        description: "Nama produk harus diisi.",
      });
      return;
    }

    if (!formData.harga || formData.harga <= 0) {
      showToast({
        type: "warning",
        heading: "Validasi",
        description: "Harga harus diisi dan lebih dari 0.",
      });
      return;
    }

    if (!formData.stok || formData.stok < 0) {
      showToast({
        type: "warning",
        heading: "Validasi",
        description: "Stok harus diisi dan tidak boleh negatif.",
      });
      return;
    }

    setLoading(true);

    const payload = {
      nama: formData.nama,
      deskripsi: formData.deskripsi,
      harga: parseFloat(formData.harga),
      stok: parseInt(formData.stok),
      penyajian: formData.penyajian,
      gambar_url: formData.gambar_url,
      is_active: formData.is_active,
    };

    const res = data
      ? await UpdateProdukService(data.id, payload)
      : await CreateProdukService(payload);

    setLoading(false);

    if (!res.status) {
      showToast({
        type: "error",
        heading: "Gagal menyimpan produk",
        description: res.message || "Terjadi kesalahan saat menyimpan produk.",
      });
      return;
    }

    showToast({
      type: "success",
      heading: data ? "Produk diupdate" : "Produk ditambahkan",
      description: data
        ? "Produk berhasil diupdate."
        : "Produk baru berhasil ditambahkan.",
    });
    onClose(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {data ? "Edit Produk" : "Tambah Produk"}
          </h1>
          <p className="text-gray-600 mt-1">
            {data ? "Update data produk" : "Tambahkan produk baru"}
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
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gambar Produk */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Produk
            </label>
            <div className="flex items-center gap-4">
              <div
                onClick={handleImageClick}
                className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition"
              >
                {uploadingImage ? (
                  <Loader2 className="animate-spin text-gray-400" size={32} />
                ) : imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto text-gray-400" size={32} />
                    <p className="text-xs text-gray-500 mt-2">Upload</p>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Klik untuk upload gambar produk
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Format: JPG, PNG (Max 2MB)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Nama Produk */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Produk *
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Masukkan nama produk"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Deskripsi */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Masukkan deskripsi produk"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Harga */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Harga *
            </label>
            <input
              type="number"
              name="harga"
              value={formData.harga}
              onChange={handleChange}
              placeholder="0"
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Stok */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stok *
            </label>
            <input
              type="number"
              name="stok"
              value={formData.stok}
              onChange={handleChange}
              placeholder="0"
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Penyajian */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Penyajian
            </label>
            <textarea
              name="penyajian"
              value={formData.penyajian}
              onChange={handleChange}
              placeholder="Contoh: Kukus 15 menit atau goreng sebentar"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Aktif</span>
            </div>
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
            disabled={loading || uploadingImage}
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

export default ProdukForm;
