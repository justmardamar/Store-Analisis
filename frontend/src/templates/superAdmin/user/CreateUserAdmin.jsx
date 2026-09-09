import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateUserAdmin() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        store_id: ""
    });

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const getStores = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/store');
            if (response.status === 200 && response.data.stores) {
                setStores(response.data.stores);
            }
        } catch (error) {
            console.error("Error fetching stores:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user.name || !user.email || !user.password || !user.store_id) {
            setMessage({ type: "error", text: "Semua bidang bertanda bintang (*) wajib diisi." });
            return;
        }

        try {
            setLoading(true);
            setMessage({ type: "", text: "" });
            const response = await axios.post('http://localhost:5000/api/superAdmin/user/create', user);
            if (response.status === 200 || response.status === 201) {
                setMessage({ type: "success", text: "User Admin berhasil dibuat!" });
                setTimeout(() => {
                    navigate("/superAdmin/showUser");
                }, 1200);
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: error.response?.data?.message || "Gagal membuat user admin." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStores();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Tambah Admin Toko Baru</h1>
                        <p className="mt-1 text-sm text-slate-500">Buat akun pengelola/admin untuk toko cabang spesifik.</p>
                    </div>
                    <Link
                        to="/superAdmin/showUser"
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
                                Nama Lengkap Admin <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={user.name}
                                onChange={handleInputChange}
                                placeholder="Contoh: Ahmad Wijaya"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                                Alamat Email <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleInputChange}
                                placeholder="admin@toko.com"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                                Password <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={user.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="store_id" className="block text-sm font-medium text-slate-700 mb-1">
                                Tempat Toko / Cabang <span className="text-rose-500">*</span>
                            </label>
                            <select
                                id="store_id"
                                name="store_id"
                                value={user.store_id}
                                onChange={handleInputChange}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            >
                                <option value="">Pilih Toko Cabang</option>
                                {stores.map((store, index) => (
                                    <option key={store.id || index} value={store.id}>
                                        {store.name} ({store.address || 'Tanpa Alamat'})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-3 flex justify-end gap-3">
                            <Link
                                to="/superAdmin/showUser"
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100 transition disabled:opacity-50"
                            >
                                {loading ? 'Menyimpan...' : 'Tambah User Admin'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}