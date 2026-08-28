import axios from "axios"
import { useState } from "react"


export default function CreateProduct(){

    const [product,setProduct] = useState({
        name : "",
        price : "",
        category : ""
    })

    const handleChange = (e) =>{
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        if(product.name === "" || product.price === "" || product.category === ""){
            alert("Semua field harus diisi")
            return
        }
        const res = axios.post('http://localhost:5000/api/product/create',{
            name : product.name,
            price : product.price,
            category : product.category
        })
        setProduct({
            name : "",
            price : "",
            category : ""
        })
    }

    return (
        <div>
            <h1>Buat Product Baru</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="">Nama</label>
                <input type="text" value={product.name} onChange={handleChange} name="name" />
                <label htmlFor="">Harga</label>
                <input type="text" value={product.price} onChange={handleChange} name="price" />
                <label htmlFor="">Kategori</label>
                <select name="category" value={product.category} onChange={handleChange}>
                    <option value="">Pilih Kategori</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Snack">Snack</option>
                </select>
                <button type="submit">Buat</button>
            </form>
        </div>
    )
}