import { useState, useEffect } from "react";
import axios from "axios";

export default function ManageBranchStore() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStores = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/store");
            setStores(response.data.stores || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Daftar Toko Bawahan</h1>
                            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20">
                                {stores.length} Toko
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">Toko-toko yang berada di bawah pengawasan dan pasokan cabang Anda.</p>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-slate-600">
                            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5 w-16 text-center">ID</th>
                                    <th className="px-6 py-3.5">Nama Toko</th>
                                    <th className="px-6 py-3.5">Alamat</th>
                                    <th className="px-6 py-3.5 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                            Memuat daftar toko...
                                        </td>
                                    </tr>
                                ) : stores.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                            Belum ada toko yang terhubung ke cabang ini.
                                        </td>
                                    </tr>
                                ) : (
                                    stores.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 text-center font-mono text-xs font-semibold text-slate-400">
                                                #{item.id}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900">
                                                {item.name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {item.address || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                    Aktif
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
