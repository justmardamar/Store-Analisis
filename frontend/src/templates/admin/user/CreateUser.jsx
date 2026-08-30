import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function CreateUser() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    store_id: localStorage.getItem('store_id'),
    role: ""
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user.name || !user.email || !user.password || !user.role) {
      setMessage({ type: "error", text: "Semua bidang bertanda bintang (*) wajib diisi." })
      return
    }

    try {
      setLoading(true)
      setMessage({ type: "", text: "" })
      await axios.post('http://localhost:5000/api/admin/user/create', user)
      setMessage({ type: "success", text: "User berhasil dibuat!" })
      setTimeout(() => {
        navigate('/admin/listUser')
      }, 1200)
    } catch (error) {
      console.error(error)
      setMessage({ type: "error", text: error.response?.data?.message || "Gagal membuat user. Periksa kembali server API." })
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Buat User Baru</h1>
            <p className="mt-1 text-sm text-slate-500">Tambahkan akun baru ke dalam sistem operasional toko.</p>
          </div>
          <Link
            to="/admin/listUser"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm transition"
          >
            &larr; Kembali
          </Link>
        </div>

        {/* Feedback Alert */}
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
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Contoh: Budi Santoso"
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
                onChange={handleChange}
                placeholder="user@toko.com"
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
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
                Role Akses <span className="text-rose-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={user.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              >
                <option value="">Pilih Role Akses</option>
                <option value="Kasir">Kasir</option>
                <option value="Stok">Stok (Warehouse)</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <Link
                to="/admin/listUser"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100 transition disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}