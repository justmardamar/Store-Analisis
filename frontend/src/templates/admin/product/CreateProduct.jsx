import axios from "axios"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function CreateProduct() {
    const navigate = useNavigate()
    const [product, setProduct] = useState({
        name: "",
        price: "",
        category: ""
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ type: "", text: "" })

    const handleChange = (e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!product.name || !product.price || !product.category) {
            setMessage({ type: "error", text: "Semua bidang bertanda bintang (*) wajib diisi." })
            return
        }

        try {
            setLoading(true)
            setMessage({ type: "", text: "" })
            await axios.post('http://localhost:5000/api/product/create', {
                name: product.name,
                price: Number(product.price),
                category: product.category
            })
            setMessage({ type: "success", text: "Produk berhasil dibuat!" })
            setTimeout(() => {
                navigate('/admin/listProduct')
            }, 1200)
        } catch (error) {
            console.error(error)
            setMessage({ type: "error", text: error.response?.data?.message || "Gagal membuat produk." })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Tambah Produk Baru</h1>
                        <p className="mt-1 text-sm text-slate-500">Masukkan rincian item baru ke dalam inventaris toko.</p>
                    </div>
                    <Link
                        to="/admin/listProduct"
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
                                Nama Produk <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                placeholder="Contoh: Kopi Susu Aren"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">
                                Harga Produk (Rp) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                placeholder="Contoh: 18000"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                                Kategori Produk <span className="text-rose-500">*</span>
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={product.category}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            >
                                <option value="">Pilih Kategori</option>
                                <option value="Makanan">Makanan</option>
                                <option value="Minuman">Minuman</option>
                                <option value="Snack">Snack</option>
                            </select>
                        </div>

                        <div className="pt-3 flex justify-end gap-3">
                            <Link
                                to="/admin/listProduct"
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100 transition disabled:opacity-50"
                            >
                                {loading ? 'Menyimpan...' : 'Buat Produk'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}