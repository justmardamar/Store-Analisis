import { useState,useEffect } from 'react'
import axios from 'axios'

export default function ListProduct(){
    const [products,setProducts] = useState([])

    const fetchData = async () => {
        const response = await axios.get('http://localhost:5000/api/products')
        setProducts(response.data.products)
    }

    useEffect(() => {
        fetchData()
    },[])

    return (
        <div>
            <h1>Daftar Product</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama</th>
                        <th>Harga</th>
                        <th>Kategori</th>
                    </tr>
                </thead>
                <tbody>
                    {products?.map((product) => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}   