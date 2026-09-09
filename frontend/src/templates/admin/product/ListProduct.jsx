import { useState, useEffect } from 'react'
import axios from 'axios'

export default function ListProduct() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [actionId, setActionId] = useState(null)
  const [message, setMessage] = useState({ type: "", text: "" })

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/store/products')
      setProducts(response.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddProductToStore = async (productId) => {
    try {
      setActionId(productId)
      setMessage({ type: "", text: "" })
      const response = await axios.post('http://localhost:5000/api/store/products', {
        product_id: productId
      })
      if (response.status === 200) {
        setMessage({ type: "success", text: "Produk berhasil ditambahkan ke katalog toko dengan stok 0!" })
        fetchData()
      }
    } catch (error) {
      console.error(error)
      setMessage({ type: "error", text: "Gagal menambahkan produk ke katalog toko." })
    } finally {
      setActionId(null)
    }
  }

  const handleRemoveProductFromStore = async (productId) => {
    try {
      setActionId(productId)
      setMessage({ type: "", text: "" })
      const response = await axios.delete(`http://localhost:5000/api/store/product/${productId}`)
      if (response.status === 200) {
        setMessage({ type: "success", text: "Produk berhasil dihapus dari katalog toko!" })
        fetchData()
      }
    } catch (error) {
      console.error(error)
      setMessage({ type: "error", text: "Gagal menghapus produk dari katalog toko." })
    } finally {
      setActionId(null)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-6xl">
        {/* Top Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Katalog Produk Toko</h1>
              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-inset ring-teal-600/20">
                {products.filter(p => p.is_in_store).length} Aktif di Toko
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">Pilih produk dari katalog master global untuk dijual di toko Anda (Stok awal = 0).</p>
          </div>
        </div>

        {/* Alert Feedback */}
        {message.text && (
          <div className={`mb-5 rounded-xl p-4 text-sm font-medium border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
            {message.text}
          </div>
        )}

        {/* Search Filter Bar */}
        <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
            />
          </div>

          <button
            onClick={fetchData}
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
                  <th className="px-6 py-3.5 w-16 text-center">ID</th>
                  <th className="px-6 py-3.5">Nama Produk</th>
                  <th className="px-6 py-3.5">Harga</th>
                  <th className="px-6 py-3.5">Kategori</th>
                  <th className="px-6 py-3.5 text-center">Stok Toko</th>
                  <th className="px-6 py-3.5 text-center">Aksi Katalog Toko</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                      Memuat katalog produk master...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      Belum ada produk master tersedia.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 text-center font-mono text-xs font-semibold text-slate-400">
                        #{product.id}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        Rp {Number(product.price || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 ring-1 ring-inset ring-teal-600/20">
                          {product.category || 'Umum'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-slate-900">
                        {product.is_in_store ? `${product.stock_quantity} Pcs` : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {product.is_in_store ? (
                          <button
                            onClick={() => handleRemoveProductFromStore(product.id)}
                            disabled={actionId === product.id}
                            className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition disabled:opacity-50"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            Hapus dari Toko
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddProductToStore(product.id)}
                            disabled={actionId === product.id}
                            className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 transition disabled:opacity-50"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            + Tambah ke Toko (Stok 0)
                          </button>
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
  )
}