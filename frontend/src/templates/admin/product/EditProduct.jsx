import { useParams } from "react-router-dom";
import { useState,useEffect } from "react"
import axios from "axios"

export default function EditProduct(){
    const { id } = useParams()
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: ""
    })

    const getProduct = async () => {
        const response = await axios.get(`http://localhost:5000/api/product/${id}`)
        const data = response.data
        setFormData({
            name: data.product.name,
            price: data.product.price,
            category: data.product.category
        })
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await axios.put(`http://localhost:5000/api/product/update/${id}`, formData)
    }

    useEffect(() => {
        getProduct()
    },[id])

    return (
        <div className="">
            <h1>Edit Product</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="">Nama</label>
                <input type="text" value={formData.name} onChange={handleChange} name="name" />
                <label htmlFor="">Harga</label>
                <input type="text" value={formData.price} onChange={handleChange} name="price" />
                <label htmlFor="">Kategori</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                    <option value="">Pilih Kategori</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Snack">Snack</option>
                </select>
                <button type="submit">Update</button>
            </form>
        </div>
    )
}   
