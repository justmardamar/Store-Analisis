import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

export default function FetchStock() {
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    const getAllProductUnlocated = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get('http://localhost:5000/api/stock/fetch-stock')
            setData(response.data.stocks || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getAllProductUnlocated()
    }, [])

    const handleSetWarehouse = (stockId) => {
        navigate(`/stock/set-location/${stockId}`)
    }

    const filteredData = data.filter(item =>
        item.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product_category?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Stok Belum Berlokasi</h1>
                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                {data.length} Unallocated
                            </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">Daftar stok barang yang belum dialokasikan ke gudang mana pun.</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="relative w-full max-w-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Cari nama produk atau kategori..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                        />
                    </div>

                    <button
                        onClick={getAllProductUnlocated}
                        title="Refresh Data"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Refresh
                    </button>
                </div>

                {/* Table Container */}
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-sm text-slate-600">
                            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                                <tr>
                                    <th className="px-6 py-3.5 w-16 text-center">No</th>
                                    <th className="px-6 py-3.5">Nama Produk</th>
                                    <th className="px-6 py-3.5">Kategori</th>
                                    <th className="px-6 py-3.5">Harga</th>
                                    <th className="px-6 py-3.5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                            Memuat data stok...
                                        </td>
                                    </tr>
                                ) : filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                            Semua stok sudah memiliki lokasi gudang (atau tidak ada data).
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item, index) => (
                                        <tr key={item.stock_id || index} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 text-center font-mono text-xs font-semibold text-slate-400">
                                                #{index + 1}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900">
                                                {item.product_name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-md bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20">
                                                    {item.product_category || "Umum"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-700">
                                                Rp {Number(item.product_price || 0).toLocaleString("id-ID")}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleSetWarehouse(item.stock_id)}
                                                    className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 transition shadow-sm"
                                                >
                                                    Set Warehouse
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-3 text-xs text-slate-500">
                        Menampilkan {filteredData.length} dari {data.length} item stok
                    </div>
                </div>
            </div>
        </div>
    )
}