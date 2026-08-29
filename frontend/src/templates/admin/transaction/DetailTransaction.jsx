import axios from "axios"
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

export default function DetailTransaction() {
    const { id } = useParams()
    const [transaction, setTransaction] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`http://localhost:5000/api/transaction/${id}`)
            setTransaction(response.data.transaction)
        } catch (error) {
            console.error("Error fetching transaction details:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-500">
                Memuat rincian transaksi...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
            <div className="mx-auto max-w-xl">
                {/* Top Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Rincian Transaksi</h1>
                        <p className="mt-1 text-sm text-slate-500">Bukti struk transaksi #{id}</p>
                    </div>
                    <Link
                        to="/admin/transaction"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm transition"
                    >
                        &larr; Kembali
                    </Link>
                </div>

                {!transaction ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                        Data transaksi tidak ditemukan.
                    </div>
                ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                        <div className="mb-6 border-b border-slate-100 pb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ID Transaksi</span>
                            <div className="font-mono text-xl font-bold text-slate-900">#{transaction.id}</div>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">Total Harga</span>
                                <span className="font-bold text-slate-900 text-base">
                                    Rp {Number(transaction.total_price || 0).toLocaleString("id-ID")}
                                </span>
                            </div>

                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">Jumlah Dibayar</span>
                                <span className="font-semibold text-slate-800">
                                    Rp {Number(transaction.amount_paid || 0).toLocaleString("id-ID")}
                                </span>
                            </div>

                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">Kembalian</span>
                                <span className="font-semibold text-slate-800">
                                    Rp {Number(transaction.change || 0).toLocaleString("id-ID")}
                                </span>
                            </div>

                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-500">Metode Pembayaran</span>
                                <span className="inline-flex items-center rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20">
                                    {transaction.payment_method || "Tunai"}
                                </span>
                            </div>

                            <div className="flex justify-between py-2">
                                <span className="text-slate-500">Status Transaksi</span>
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                    {transaction.status || "Selesai"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}