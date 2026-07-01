import axios from "axios";
import { useState } from "react";

export default function CreateUser(){
    const [user,setUser] = useState({
        name : "",
        email : "",
        password : "",
        role : ""
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setUser({
            ...user,
            [name] : value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await axios.post('http://localhost:5000/api/user/create',user)
        if(response.status === 200){
            alert("User berhasil ditambahkan")
            setUser({
                name : "",
                email : "",
                password : "",
                role : ""
            })
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nama</label>
            <input type="text" name="name" placeholder="Masukkan Nama User" onChange={handleInputChange}/>
            <label htmlFor="email">Email</label>
            <input type="text" name="email" placeholder="Masukkan Email" onChange={handleInputChange}/>
            <label htmlFor="password">Password</label>
            <input type="text" name="password" placeholder="Masukkan Password" onChange={handleInputChange}/>
            <label htmlFor="role">Role</label>
            <select name="role" onChange={handleInputChange}>
                <option value="kasir">Kasir</option>
                <option value="Stok">Stok</option>
            </select>
            <button type="submit">Tambah User</button>
        </form>
    )
}