import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateStore() {
    const navigate = useNavigate();
    const [store, setStore] = useState({
        name: "",
        address: "",
        status: "active"
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStore({
            ...store,
            [name]: value,
        });
    };

    const handleCreateStore = async (e) => {
        e.preventDefault();
        if (!store.name || !store.address) {
            setMessage({ type: "error", text: "Nama toko dan alamat toko wajib diisi." });
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: "", text: "" });
            const res = await axios.post("http://localhost:5000/api/store/create", store);
            if (res.status === 200 || res.status === 201 || res.data.message) {
                setMessage({ type: "success", text: "Toko berhasil dibuat!" });
                setTimeout(() => {
                    navigate("/superAdmin/showStore");
                }, 1200);
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: error.response?.data?.message || "Gagal membuat toko. Periksa koneksi API." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Tambah Toko Baru</h1>
                        <p className="mt-1 text-sm text-slate-500">Daftarkan cabang atau outlet toko baru ke dalam sistem.</p>
                    </div>
                    <Link
                        to="/superAdmin/showStore"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm transition"
                    >
                        &larr; Kembali
                    </Link>
                </div>

                {/* Alert */}
                {message.text && (
                    <div className={`mb-5 rounded-xl p-4 text-sm font-medium border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                        {message.text}
                    </div>
                )}

                {/* Form Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                    <form onSubmit={handleCreateStore} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                                Nama Toko / Cabang <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={store.name}
                                onChange={handleInputChange}
                                placeholder="Contoh: Toko Cabang Sudirman"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                                Alamat Lengkap <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                rows="3"
                                value={store.address}
                                onChange={handleInputChange}
                                placeholder="Contoh: Jl. Jend. Sudirman No. 123, Jakarta Selatan"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
                                Status Operasional
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={store.status}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            >
                                <option value="active">Aktif</option>
                                <option value="inactive">Tidak Aktif</option>
                            </select>
                        </div>

                        <div className="pt-3 flex justify-end gap-3">
                            <Link
                                to="/superAdmin/showStore"
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100 transition disabled:opacity-50"
                            >
                                {loading ? 'Menyimpan...' : 'Simpan Toko'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}