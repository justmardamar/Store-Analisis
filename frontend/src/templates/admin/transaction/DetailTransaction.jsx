import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function DetailTransaction(){
    const {id} = useParams()

    const [transaction,setTransaction] = useState([])

    const fetchData = async () => {
        const response = await axios.get(`http://localhost:8000/api/transaction/${id}`)
        setTransaction(response.data.transaction)
    }
    useEffect(() => {
        fetchData()
    },[])

    return(
        <div>
            <h1>Detail Transaksi</h1>
            <p>ID : {transaction.id}</p>
            <p>Total Harga : {transaction.total_price}</p>
            <p>Jumlah Dibayar : {transaction.amount_paid}</p>
            <p>Kembalian : {transaction.change}</p>
            <p>Metode Pembayaran : {transaction.payment_method}</p>
            <p>Status : {transaction.status}</p>
        </div>
    )
}