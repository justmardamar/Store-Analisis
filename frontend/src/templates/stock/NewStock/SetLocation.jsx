import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function SetLocation() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [warehouseId, setWarehouseId] = useState('');
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!warehouseId) {
            setMessage({ type: "error", text: "Silakan pilih gudang." });
            return;
        }
        try {
            setLoading(true);
            setMessage({ type: "", text: "" });
            const response = await axios.post(`http://localhost:5000/api/stock/set-warehouse/${id}`, {
                warehouse_id: warehouseId
            });
            if (response.status === 200) {
                setMessage({ type: "success", text: "Lokasi gudang berhasil ditambahkan!" });
                setTimeout(() => {
                    navigate('/stock/fetch-stock');
                }, 1200);
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: error.response?.data?.message || "Gagal menetapkan lokasi gudang." });
        } finally {
            setLoading(false);
        }
    }

    const getWarehouseOptions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/warehouse/store');
            setWarehouses(response.data.warehouses || response.data || []);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getWarehouseOptions();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
            <div className="mx-auto max-w-xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Set Lokasi Gudang</h1>
                        <p className="mt-1 text-sm text-slate-500">Pilih gudang penyimpan untuk stok #{id}</p>
                    </div>
                    <Link
                        to="/stock/fetch-stock"
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
                            <label htmlFor="warehouse" className="block text-sm font-medium text-slate-700 mb-1">
                                Pilih Gudang <span className="text-rose-500">*</span>
                            </label>
                            <select
                                id="warehouse"
                                value={warehouseId}
                                onChange={(e) => setWarehouseId(e.target.value)}
                                required
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            >
                                <option value="">-- Pilih Gudang --</option>
                                {warehouses.map((warehouse) => (
                                    <option key={warehouse.id} value={warehouse.id}>
                                        {warehouse.name} {warehouse.location ? `- ${warehouse.location}` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-3 flex justify-end gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100 transition disabled:opacity-50"
                            >
                                {loading ? 'Menyimpan...' : 'Simpan Lokasi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}