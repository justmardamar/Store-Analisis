import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"
import axios from "axios"

export default function EditProduct() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: ""
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: "", text: "" })

    const getProduct = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`http://localhost:5000/api/product/${id}`)
            const data = response.data
            if (data.product) {
                setFormData({
                    name: data.product.name || "",
                    price: data.product.price || "",
                    category: data.product.category || ""
                })
            }
        } catch (error) {
            console.error("Error loading product:", error)
            setMessage({ type: "error", text: "Gagal memuat data produk." })
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSaving(true)
            setMessage({ type: "", text: "" })
            await axios.put(`http://localhost:5000/api/product/update/${id}`, formData)
            setMessage({ type: "success", text: "Produk berhasil diperbarui!" })
            setTimeout(() => {
                navigate('/admin/listProduct')
            }, 1200)
        } catch (error) {
            console.error(error)
            setMessage({ type: "error", text: error.response?.data?.message || "Gagal memperbarui produk." })
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        getProduct()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-500">
                Memuat data produk...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
            <div className="mx-auto max-w-2xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Edit Produk</h1>
                        <p className="mt-1 text-sm text-slate-500">Perbarui rincian produk #{id}.</p>
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
                                Nama Produk
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nama produk"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-1">
                                Harga Produk (Rp)
                            </label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Harga produk"
                                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
                                Kategori Produk
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
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
                                disabled={saving}
                                className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100 transition disabled:opacity-50"
                            >
                                {saving ? 'Menyimpan...' : 'Perbarui Produk'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

