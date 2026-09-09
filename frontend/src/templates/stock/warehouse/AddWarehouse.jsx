import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddWarehouse() {
    const navigate = useNavigate();
    const [wareLocation, setWareLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleData = async (e) => {
        e.preventDefault();
        if (!wareLocation.trim()) {
            setMessage({ type: "error", text: "Lokasi gudang wajib diisi." });
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: "", text: "" });
            const response = await axios.post('http://localhost:5000/api/warehouse/create', { location: wareLocation });
            if (response.status === 200 || response.status === 201) {
                setMessage({ type: "success", text: "Warehouse berhasil ditambahkan!" });
                setTimeout(() => {
                    navigate('/stock/warehouses');
                }, 1200);
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: error.response?.data?.message || "Gagal menambahkan warehouse." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
            <div className="mx-auto max-w-xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Tambah Warehouse Baru</h1>
                        <p className="mt-1 text-sm text-slate-500">Daftarkan lokasi gudang penyimpan baru untuk toko Anda.</p>
                    </div>
                    <Link
                        to="/stock/warehouses"
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
                    <form onSubmit={handleData} className="space-y-5">
                        <div>
                            <label htmlFor="wareLocation" className="block text-sm font-medium text-slate-700 mb-1">
                                Lokasi Gudang <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="wareLocation"
                                placeholder="Contoh: Gudang A - Lantai 2 / Jakarta Barat"
                                value={wareLocation}
                                onChange={(e) => setWareLocation(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        <div className="pt-3 flex justify-end gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100 transition disabled:opacity-50"
                            >
                                {loading ? 'Menyimpan...' : 'Tambah Gudang'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}