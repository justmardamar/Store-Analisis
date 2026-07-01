import axios from "axios";
import { useState } from "react";

export default function CreateSupplier(){
    const [supplier,setSupplier] = useState({
        name : "",
        phoneNumber : "",
        address : ""
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setSupplier({
            ...supplier,
            [name] : value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await axios.post('http://localhost:5000/api/supplier/create',supplier)
        if(response.status === 200){
            alert("Supplier berhasil ditambahkan")
            setSupplier({
                name : "",
                phoneNumber : "",
                address : ""
            })
        }
    }
    
    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nama</label>
            <input type="text" name="name" placeholder="Masukkan Nama Supplier" onChange={handleInputChange}/>
            <label htmlFor="phoneNumber">Nomor Handphone</label>
            <input type="text" name="phoneNumber" placeholder="Masukkan nomor handphone" onChange={handleInputChange}/>
            <label htmlFor="address">Alamat</label>
            <textarea name="address" onChange={handleInputChange}></textarea>
            <button type="submit">Tambah Supplier</button>
        </form>
    )
}