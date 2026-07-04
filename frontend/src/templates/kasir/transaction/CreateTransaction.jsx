import axios from "axios"
import { useState, useEffect } from "react"

export default function CreateTransaction(){
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState([])
    const [paymentMethod, setPaymentMethod] = useState('Tunai')
    const [amountPaid, setAmountPaid] = useState(0)

    const getProducts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/product")
            setProducts(response.data.products || [])
        } catch (error) {
            console.error("Gagal mengambil data produk:", error)
        }
    }

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id)
        if (existingItem) {
            setCart(cart.map(item => 
                item.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
            ))
        } else {
            setCart([...cart, { ...product, quantity: 1 }])
        }
    }

    const handleQuantityChange = (id, value) => {
        const qty = parseInt(value)
        setCart(cart.map(item => 
            item.id === id 
                ? { ...item, quantity: isNaN(qty) || qty < 1 ? 1 : qty } 
                : item
        ))
    }

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id))
    }

    const createTransaction = async () => {
        const response = await axios.post('http://localhost:5000/api/transaction/create', {
            products: cart,
            total_price: grandTotal,
            payment_method: paymentMethod,
            amount_paid: amountPaid,
            status: 'Selesai'
        })
    }

    useEffect(() => {
        getProducts()
    }, [])

    const grandTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    return(
        <div className="w-full px-6 py-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-xl font-bold mb-4">Daftar Produk</h1>
                {products.map((product) => (
                    <div key={product.id} className="w-[200px] border p-2 mb-2 rounded shadow-sm">
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-gray-600">Rp {product.price}</p>
                        <button 
                            onClick={() => addToCart(product)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-sm mt-2 hover:bg-blue-600"
                        >
                            Tambah
                        </button>
                    </div>
                ))}
            </div>

            <h1 className="text-xl font-bold mt-6 mb-4">Keranjang</h1>
            {cart.length === 0 && <p className="text-gray-500">Keranjang kosong</p>}
            
            {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b py-2">
                    <p className="w-1/4">{item.name}</p>
                    <p className="w-1/6">Rp {item.price}</p>

                    <input 
                        type="number" 
                        name="quantity" 
                        min={1} 
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="w-16 border rounded px-2 py-1 text-center"
                    />
                    
                    <p className="w-1/4">Total item: Rp {item.price * item.quantity}</p>
                    
                    <button 
                        onClick={() => removeFromCart(item.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                    >
                        Hapus
                    </button>
                </div>
            ))}



            <form onSubmit={(e) => e.preventDefault()} className="mt-6">
                <p className="text-lg font-bold">Total : Rp {grandTotal}</p>
                <select name="payment_method" onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="Tunai">Tunai</option>
                    <option value="Qris">Qris</option>
                </select>
                {paymentMethod === 'Tunai' && (
                    <input type="number" name="amount_paid" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} className="border rounded px-2 py-1 text-center" />
                )}
                <button 
                    onClick={createTransaction}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
                >
                    Bayar
                </button>
            </form>
        </div>
    )
}