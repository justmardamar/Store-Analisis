import { useState,useEffect } from "react";
import axios from "axios"
import { Link } from "react-router-dom";

export default function ShowTransaction(){
    const [transaction,setTransaction] = useState([])
    
    const getTransaction = async () => {
        const transactions = await axios.get("http://localhost:5000/api/transaction")
        setTransaction(transactions.data)
    }

    useEffect(() => {
        getTransaction()
    },[])

    return(
        <div className="">
            <Link to="/kasir/transaction/create" className="btn btn-primary mb-3">Create Transaction</Link>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Total Price</th>
                        <th>Payment Method</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {transaction.map((trans) => (
                        <tr key={trans.id}>
                            <td>{trans.id}</td>
                            <td>{trans.total_price}</td>
                            <td>{trans.payment_method}</td>
                            <td>{trans.created_at}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}