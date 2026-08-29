import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function ListTransaction() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await axios.get('http://localhost:5000/api/transactions')
            setTransactions(response.data.transactions || [])
        } catch (error) {
            console.error("Error fetching transactions:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Daftar Transaksi</h1>
                            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20">
                                {transactions.length} Transaksi
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">Riwayat transaksi penjualan toko.</p>
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-slate-600">
                            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5 w-16 text-center">No</th>
                                    <th className="px-6 py-3.5">Total Harga</th>
                                    <th className="px-6 py-3.5">Jumlah Dibayar</th>
                                    <th className="px-6 py-3.5">Kembalian</th>
                                    <th className="px-6 py-3.5">Metode Pembayaran</th>
                                    <th className="px-6 py-3.5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                            <span>Memuat data transaksi...</span>
                                        </td>
                                    </tr>
                                ) : transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            Belum ada data transaksi.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((transaction, index) => (
                                        <tr key={transaction.id || index} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 text-center font-medium text-slate-400">{index + 1}</td>
                                            <td className="px-6 py-4 font-semibold text-slate-900">
                                                Rp {Number(transaction.total_price || 0).toLocaleString("id-ID")}
                                            </td>
                                            <td className="px-6 py-4 text-slate-700">
                                                Rp {Number(transaction.amount_paid || 0).toLocaleString("id-ID")}
                                            </td>
                                            <td className="px-6 py-4 text-slate-700">
                                                Rp {Number(transaction.change || 0).toLocaleString("id-ID")}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-md bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20">
                                                    {transaction.payment_method || "Tunai"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Link
                                                    to={`/admin/transaction/${transaction.id}`}
                                                    className="inline-flex items-center text-xs font-medium text-teal-600 hover:text-teal-800 hover:underline"
                                                >
                                                    Detail &rarr;
                                                </Link>
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
    )
}