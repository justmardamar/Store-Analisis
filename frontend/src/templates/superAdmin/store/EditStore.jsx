import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function EditStore() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [store, setStore] = useState({
        name: "",
        address: "",
        status: "active"
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const fetchStore = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/store/${id}`);
            if (response.data.store) {
                setStore({
                    name: response.data.store.name || "",
                    address: response.data.store.address || "",
                    status: response.data.store.status || "active"
                });
            }
        } catch (error) {
            console.error("Error fetching store:", error);
            setMessage({ type: "error", text: "Gagal memuat data toko." });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage({ type: "", text: "" });
            const response = await axios.put(`http://localhost:5000/api/store/update/${id}`, store);
            if (response.status === 200 || response.status === 201) {
                setMessage({ type: "success", text: "Data toko berhasil diperbarui!" });
                setTimeout(() => {
                    navigate("/superAdmin/showStore");
                }, 1200);
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: error.response?.data?.message || "Gagal mengupdate toko." });
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchStore();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-500">
                Memuat data toko...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Edit Data Toko</h1>
                        <p className="mt-1 text-sm text-slate-500">Perbarui rincian toko/cabang #{id}.</p>
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
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                                Nama Toko / Cabang
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={store?.name}
                                onChange={(e) => setStore({ ...store, name: e.target.value })}
                                placeholder="Nama Toko"
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                                Alamat Lengkap
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                rows="3"
                                value={store?.address}
                                onChange={(e) => setStore({ ...store, address: e.target.value })}
                                placeholder="Alamat Toko"
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
                                Status Store
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={store?.status}
                                onChange={(e) => setStore({ ...store, status: e.target.value })}
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            >
                                <option value="">-- Pilih Status --</option>
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
                                disabled={saving}
                                className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100 transition disabled:opacity-50"
                            >
                                {saving ? 'Menyimpan...' : 'Update Toko'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}