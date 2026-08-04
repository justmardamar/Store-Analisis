import { useParams } from "react-router-dom";
import {useState} from "react";
import axios from "axios";

export default function EditStore(){
    const { id } = useParams()
    const [store, setStore] = useState()

    const fetchStore = async () => {
        const response = await axios.get(`http://localhost:5000/api/store/${id}`)
        setStore(response.data.store)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = await axios.put(`http://localhost:5000/api/store/update/${id}`, store)
        if(response.status === 200){
            alert("Store berhasil diupdate")
        }
    }

    useEffect(() => {
        fetchStore()
    }, [id])

    return(
        <div onSubmit={handleSubmit}>
            <form action="">
                <label htmlFor="name">Nama Store</label>
                <input type="text" name="name" id="name" value={store?.name} onChange={(e) => setStore({...store, name: e.target.value})} required/>
                <label htmlFor="address">Alamat Store</label>
                <input type="text" name="address" id="address" value={store?.address} onChange={(e) => setStore({...store, address: e.target.value})} required/>
                <label htmlFor="status">Status Store</label>
                <select name="status" id="status" value={store?.status} onChange={(e) => setStore({...store, status: e.target.value})} required>
                    <option value="">-- Pilih Status --</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                </select>
                <button type="submit">Update Store</button>
            </form>
        </div>
    )
}