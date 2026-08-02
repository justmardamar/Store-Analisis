import axios from "axios";
import { useEffect, useState } from "react";

export default function UpdateStockData(){
    const [updates,setUpdate] = useState([])

    const fetchData = async () => {
        const res = await axios.get('http://localhost:8000/api/stock/updateWarehouse')
        setUpdate(res)
    }
    useEffect(() => {
        fetchData()
    },[])

    return(
        <div className="">
            {updates ? 
            <div className="">
                <h2>Penataan Warehouse</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama Produk</th>
                            <th>Kategori</th>
                            <th>Harga</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {updates.map((update) => (
                            <tr key={update.id}>
                                <td>{update.id}</td>
                                <td>{update.product_name}</td>
                                <td>{update.product_category}</td>
                                <td>{update.product_price}</td>
                                <td>
                                    <button>Tambah lokasi gudang</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> 
            : 'Belum ada data stock yang ditambahkan'}
        </div>
    )
}