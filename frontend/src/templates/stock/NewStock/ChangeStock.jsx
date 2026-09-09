import axios from "axios"
import { useState, useEffect } from "react"

export default function ChangeStock() {
    const [stocks, setStocks] = useState([])
    const [loading, setLoading] = useState(true)
    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await axios.get('http://localhost:5000/api/stock')
            setStocks(response.data.stocks || [])
        } catch (error) {
            console.error("Error fetching stocks:", error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    return(
        <div className="">
            <table>
                <thead>
                    <tr>
                        <th>Produk</th>
                        <th>Warehouse location</th>
                        <th>Supplier</th>
                        <th>Date</th>
                        <th>Quantity</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock) => (
                        <tr key={stock.id}>
                            <td>{stock.name}</td>
                            <td>{stock.location}</td>
                            <td>{stock.supplier_name}</td>
                            <td>{stock.date}</td>
                            <td>{stock.quantity}</td>
                            <td>
                                <a href={`/stock/change-stock/${stock.id}`}>Ubah</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}