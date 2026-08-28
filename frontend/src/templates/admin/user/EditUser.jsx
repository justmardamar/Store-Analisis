import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function EditUser(){
    const { id } = useParams();
    const [user,setUser] = useState({
        name : "",
        email : "",
        password : "",
        store_id : "",
        role : ''
    })

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:5000/api/user/${id}`);
            setUser(response.data.user);
        }
        fetchData();
    }, [id]);

    return(
        <form>
            <label htmlFor="name">Nama</label>
            <input type="text" name="name" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} placeholder="Masukkan Nama User"/>
            <label htmlFor="email">Email</label>
            <input type="text" name="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} placeholder="Masukkan Email"/>
            <label htmlFor="password">Password</label>
            <input type="text" name="password" value={user.password} onChange={(e) => setUser({...user, password: e.target.value})} placeholder="Masukkan Password"/>
            <label htmlFor="store_id">Tempat Toko</label>
            <input type="text" name="store_id" value={user.store_id} onChange={(e) => setUser({...user, store_id: e.target.value})} placeholder="Masukkan Tempat Toko"/>
            <label htmlFor="role">Role</label>
            <select name="role" value={user.role} onChange={(e) => setUser({...user, role: e.target.value})}>
                <option value="">Pilih Role</option>
                <option value="Kasir">Kasir</option>
                <option value="Stok">Stok</option>
            </select>
        </form>
    )
}