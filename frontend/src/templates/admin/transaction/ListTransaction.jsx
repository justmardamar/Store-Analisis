import axios from "axios"
import { useEffect, useState } from "react"

export default function ListTransaction(){
    const [transactions,setTransactions] = useState([])

    const fetchData = () => {
        const response = axios.get('http://localhost:5000/api/transactions')
        setTransactions(response.data.transactions)
    }

    useEffect(() => {
        fetchData()
    },[])

    return(
        <div>
            <h1>List Transaksi</h1>
            <table border="1" cellPadding="10" cellSpacing="0" style={{textAlign : "center"}}>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Total Harga</th>
                        <th>Jumlah Dibayar</th>
                        <th>Kembalian</th>
                        <th>Metode Pembayaran</th>
                        <th>Detail</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{transaction.total_price}</td>
                            <td>{transaction.amount_paid}</td>
                            <td>{transaction.change}</td>
                            <td>{transaction.payment_method}</td>
                            <td><Link to={`/admin/transaction/${transaction.id}`}>Detail</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}