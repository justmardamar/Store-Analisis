import axios from "axios";
import { useState } from "react";

export default function CreateDataStock(){
    const [stok,setStok] = useState({
        product_id: "",
        supplier_id: ""
    })

    const handleChange = (e) => {
        setStok({
            ...stok,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:5000/api/stock/create', stok)
        if (response.data.message === "Stock created successfully") {
            alert("Stock created successfully")
            setStok({
                product_id: "",
                supplier_id: ""
            })
        }
    }

    return(
        <div>
            <h1>Buat Stok Baru</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="">Produk</label>
                <input type="text" name="product_id" value={stok.product_id} onChange={handleChange} />
                <label htmlFor="">Supplier</label>
                <input type="text" name="supplier_id" value={stok.supplier_id} onChange={handleChange} />
                <button type="submit">Buat Stok Baru</button>
            </form>
        </div>
    )

}