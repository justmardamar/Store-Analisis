import { useState } from 'react'
import axios from 'axios'

export default function CreateUser(){
    const [user,setUser] = useState({
        name : "",
        email : "",
        password : "",
        store_id : "",
        role : ''
    })

    return(
        <form>
            <label htmlFor="name">Nama</label>
            <input type="text" name="name" placeholder="Masukkan Nama User"/>
            <label htmlFor="email">Email</label>
            <input type="text" name="email" placeholder="Masukkan Email"/>
            <label htmlFor="password">Password</label>
            <input type="text" name="password" placeholder="Masukkan Password"/>
            <label htmlFor="store_id">Tempat Toko</label>
            <label htmlFor="role">Role</label>
            <select name="role">
                <option value="">Pilih Role</option>
                <option value="Kasir">Kasir</option>
                <option value="Stok">Stok</option>
            </select>
        </form>
    )

}