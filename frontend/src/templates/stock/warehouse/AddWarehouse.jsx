import { useState } from "react";
import axios from "axios";

export default function AddWarehouse(){
    const [wareLocation,setWareLocation] = useState('')

    const handleData = async (e) => {
        e.preventDefault()
        const response = await axios.post('http://localhost:5000/api/warehouse/create',{location : wareLocation})
        if(response.status === 200){
            alert("Warehouse berhasil ditambahkan")
            setWareLocation('')
        }
    }

    return(
        <div className="">
            <form onSubmit={handleData}>
                <label>Lokasi Gudang</label>
                <input type="text" placeholder="Lokasi Gudang" value={wareLocation} onChange={(e) => setWareLocation(e.target.value)} />
                <button type="submit">Tambah Gudang</button>
            </form>
        </div>
    )
}