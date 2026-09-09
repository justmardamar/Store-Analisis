import { useState, useEffect } from "react";
import axios from "axios";

export default function ShowBranchRequest() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [message, setMessage] = useState({ type: "", text: "" });

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/stock/requests");
            setRequests(response.data.stock_requests || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleUpdateStatus = async (requestId, nextStatus) => {
        try {
            setUpdatingId(requestId);
            setMessage({ type: "", text: "" });
            const response = await axios.put(`http://localhost:5000/api/stock/request/${requestId}/status`, {
                status: nextStatus
            });

            if (response.status === 200) {
                setMessage({ type: "success", text: `Status request berhasil diubah menjadi '${nextStatus}'` });
                fetchRequests();
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Gagal mengupdate status request barang." });
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">Menunggu (Pending)</span>;
            case "accepted":
                return <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">Disetujui Cabang (Accepted)</span>;
            case "delivered":
                return <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 ring-1 ring-inset ring-purple-600/20">Dikirimkan (Delivered)</span>;
            case "completed":
                return <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">Selesai (Completed)</span>;
            default:
                return <span className="inline-flex items-center rounded-md bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Kelola Permintaan Stok Toko</h1>
                            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20">
                                Dashboard Cabang
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">Terima dan proses pengiriman pasokan produk ke toko-toko bawahan cabang Anda.</p>
                    </div>

                    <button
                        onClick={fetchRequests}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 shadow-sm transition"
                    >
                        Refresh Data
                    </button>
                </div>

                {/* Alert */}
                {message.text && (
                    <div className={`mb-5 rounded-xl p-4 text-sm font-medium border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                        {message.text}
                    </div>
                )}

                {/* Table Container */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-slate-600">
                            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5 w-16 text-center">ID</th>
                                    <th className="px-6 py-3.5">Nama Toko</th>
                                    <th className="px-6 py-3.5">Nama Produk</th>
                                    <th className="px-6 py-3.5 text-center">Kuantitas</th>
                                    <th className="px-6 py-3.5 text-center">Status</th>
                                    <th className="px-6 py-3.5 text-center">Aksi Cabang</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                            Memuat permintaan stok toko...
                                        </td>
                                    </tr>
                                ) : requests.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            Belum ada permintaan stok dari toko bawahan.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 text-center font-mono text-xs font-semibold text-slate-400">
                                                #{item.id}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900">
                                                {item.store_name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-800 font-medium">
                                                {item.product_name}
                                            </td>
                                            <td className="px-6 py-4 text-center font-semibold text-slate-900">
                                                {item.quantity} Pcs
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(item.status)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {item.status === "pending" && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(item.id, "accepted")}
                                                        disabled={updatingId === item.id}
                                                        className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 transition shadow-sm disabled:opacity-50"
                                                    >
                                                        Terima Request
                                                    </button>
                                                )}
                                                {item.status === "accepted" && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(item.id, "delivered")}
                                                        disabled={updatingId === item.id}
                                                        className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 transition shadow-sm disabled:opacity-50"
                                                    >
                                                        Kirim Barang
                                                    </button>
                                                )}
                                                {item.status === "delivered" && (
                                                    <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2 py-1 rounded">Dalam Pengiriman</span>
                                                )}
                                                {item.status === "completed" && (
                                                    <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded">Diterima Toko</span>
                                                )}
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
