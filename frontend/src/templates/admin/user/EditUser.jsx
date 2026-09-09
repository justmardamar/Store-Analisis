import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    store_id: "",
    role: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/user/${id}`);
        if (response.data.user) {
          setUser({
            name: response.data.user.name || "",
            email: response.data.user.email || "",
            password: "",
            store_id: response.data.user.store_id || "",
            role: response.data.user.role || ""
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage({ type: "error", text: "Gagal memuat data user." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });
      await axios.put(`http://localhost:5000/api/user/update/${id}`, user);
      setMessage({ type: "success", text: "Data user berhasil diperbarui!" });
      setTimeout(() => {
        navigate("/admin/listUser");
      }, 1200);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.response?.data?.message || "Gagal memperbarui user." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-500">
        Memuat data user...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Edit Data User</h1>
            <p className="mt-1 text-sm text-slate-500">Perbarui profil dan wewenang akun #{id}.</p>
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
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="Masukkan Nama User"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Masukkan Email"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password Baru <span className="text-xs text-slate-400 font-normal">(Kosongkan jika tidak ingin mengubah)</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>

            <div>
              <label htmlFor="store_id" className="block text-sm font-medium text-slate-700 mb-1">
                ID Tempat Toko (Store ID)
              </label>
              <input
                type="text"
                id="store_id"
                name="store_id"
                value={user.store_id}
                onChange={(e) => setUser({ ...user, store_id: e.target.value })}
                placeholder="Masukkan ID Toko"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">
                Role Akses
              </label>
              <select
                id="role"
                name="role"
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              >
                <option value="">Pilih Role</option>
                <option value="Kasir">Kasir</option>
                <option value="Stok">Stok</option>
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
                disabled={saving}
                className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-100 transition disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Perbarui User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}