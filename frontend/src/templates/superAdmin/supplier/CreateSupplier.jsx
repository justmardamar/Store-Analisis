import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateSupplier() {
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState({
        name: "",
        phoneNumber: "",
        address: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSupplier({
            ...supplier,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!supplier.name || !supplier.phoneNumber) {
            setMessage({ type: "error", text: "Nama supplier dan Nomor Handphone wajib diisi." });
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: "", text: "" });
            const response = await axios.post('http://localhost:5000/api/supplier/create', supplier);
            if (response.status === 200 || response.status === 201) {
                setMessage({ type: "success", text: "Supplier berhasil ditambahkan!" });
                setTimeout(() => {
                    navigate("/superAdmin/showSupplier");
                }, 1200);
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: error.response?.data?.message || "Gagal menambahkan supplier." });
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
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Tambah Supplier Baru</h1>
                        <p className="mt-1 text-sm text-slate-500">Daftarkan mitra pemasok atau vendor bahan/barang toko.</p>
                    </div>
                    <Link
                        to="/superAdmin/showSupplier"
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
                                Nama Supplier / Perusahaan <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={supplier.name}
                                onChange={handleInputChange}
                                placeholder="Contoh: PT Sumber Pangan Utama"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-1">
                                Nomor Handphone / Telepon <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={supplier.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="Contoh: 081234567890"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
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
                                value={supplier.address}
                                onChange={handleInputChange}
                                placeholder="Alamat pabrik / gudang supplier"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        <div className="pt-3 flex justify-end gap-3">
                            <Link
                                to="/superAdmin/showSupplier"
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100 transition disabled:opacity-50"
                            >
                                {loading ? 'Menyimpan...' : 'Tambah Supplier'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}