import axios from "axios";
import { useState,useEffect } from "react";

export default function CreateUser(){
    const [user,setUser] = useState({
        name : "",
        email : "",
        password : "",
        role : ""
    })

    const [stores, setStores] = useState([])

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setUser({
            ...user,
            [name] : value
        })
    }

    const getStores = async () => {
        const response = await axios.get('http://localhost:5000/api/store')
        if(response.status === 200){
            setStores(response.data.stores)
        }
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
            })
        }
    }

    useEffect(() => {
        getStores()
    },[])

    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Nama</label>
            <input type="text" name="name" placeholder="Masukkan Nama User" onChange={handleInputChange}/>
            <label htmlFor="email">Email</label>
            <input type="text" name="email" placeholder="Masukkan Email" onChange={handleInputChange}/>
            <label htmlFor="password">Password</label>
            <input type="text" name="password" placeholder="Masukkan Password" onChange={handleInputChange}/>
            <label htmlFor="store_id">Tempat Toko</label>
            <select name="store_id">
                {stores.map((store) => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                ))}
            </select>

            <button type="submit">Tambah User</button>
        </form>
    )
}