import { useState, useEffect } from "react";
import axios from "axios";

export default function StockRequestView() {
    const [requests, setRequests] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [showModal, setShowModal] = useState(false);

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

    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/store/products");
            setProducts(response.data.products || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRequests();
        fetchProducts();
    }, []);

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        if (!selectedProduct || quantity <= 0) {
            setMessage({ type: "error", text: "Silakan pilih produk dan tentukan kuantitas valid." });
            return;
        }

        try {
            setSubmitting(true);
            setMessage({ type: "", text: "" });
            const response = await axios.post("http://localhost:5000/api/stock/requests", {
                product_id: selectedProduct,
                quantity: parseInt(quantity)
            });

            if (response.status === 200 || response.status === 201) {
                setMessage({ type: "success", text: "Request barang berhasil dikirim ke Cabang!" });
                setShowModal(false);
                setSelectedProduct("");
                setQuantity(1);
                fetchRequests();
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: error.response?.data?.message || "Gagal mengajukan request barang." });
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmReceived = async (requestId) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/stock/request/${requestId}/status`, {
                status: "completed"
            });
            if (response.status === 200) {
                setMessage({ type: "success", text: "Barang berhasil diterima & stok toko bertambah!" });
                fetchRequests();
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: "error", text: "Gagal mengonfirmasi penerimaan barang." });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return <span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">Menunggu Cabang (Pending)</span>;
            case "accepted":
                return <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">Diterima Cabang (Accepted)</span>;
            case "delivered":
                return <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 ring-1 ring-inset ring-purple-600/20">Dalam Pengiriman (Delivered)</span>;
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
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Request Kebutuhan Barang</h1>
                            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20">
                                {requests.length} Permintaan
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">Ajukan pasokan produk baru dari Cabang penanggung jawab toko Anda.</p>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100 transition"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Buat Request Barang Baru
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
                                    <th className="px-6 py-3.5">Nama Produk</th>
                                    <th className="px-6 py-3.5">Kategori</th>
                                    <th className="px-6 py-3.5 text-center">Kuantitas</th>
                                    <th className="px-6 py-3.5 text-center">Status</th>
                                    <th className="px-6 py-3.5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                            Memuat riwayat request stok...
                                        </td>
                                    </tr>
                                ) : requests.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            Belum ada pengajuan request stok barang.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 text-center font-mono text-xs font-semibold text-slate-400">
                                                #{item.id}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900">
                                                {item.product_name}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {item.product_category || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-center font-semibold text-slate-900">
                                                {item.quantity} Pcs
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(item.status)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {item.status === "delivered" ? (
                                                    <button
                                                        onClick={() => handleConfirmReceived(item.id)}
                                                        className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition"
                                                    >
                                                        Konfirmasi Diterima
                                                    </button>
                                                ) : item.status === "completed" ? (
                                                    <span className="text-xs text-slate-400 font-medium">Selesai</span>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">Menunggu Cabang</span>
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

            {/* Modal Request Form */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                            <h2 className="text-lg font-bold text-slate-900">Form Request Kebutuhan Barang</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
                            >
                                &#x2715;
                            </button>
                        </div>
                        <form onSubmit={handleCreateRequest} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Pilih Produk <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={selectedProduct}
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                                >
                                    <option value="">-- Pilih Produk dari Katalog --</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} (Stok Saat Ini: {p.stock_quantity})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Jumlah Kuantitas Request <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                                />
                            </div>

                            <div className="pt-3 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 transition disabled:opacity-50"
                                >
                                    {submitting ? "Kirim..." : "Kirim Request"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
