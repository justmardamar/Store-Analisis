import axios from "axios"
import { useState } from "react"


export default function CreateWarehouse(){
    const [location,setLocation] = useState("")

    const handleSubmit = async () => {
        const response = await axios.post('http://localhost:5000/api/warehouse/create',{
            location : location
        })
        if(response.data.message === "Tempat Gudang sudah ada"){
            alert("Tempat Gudang sudah ada")
        }
        else{
            alert("Tempat Gudang berhasil dibuat")
            setLocation("")
        }
    }

    return(
        <div>
            <h1>Buat Tempat Gudang Baru</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="">Lokasi</label>
                <input type="text" value={location} onChange={(e)=>setLocation(e.target.value)} />
                <button type="submit">Buat dan tambah baru</button>
            </form>
        </div>
    )
}