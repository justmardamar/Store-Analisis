import axios from "axios";
import { useState } from "react";

export default function SetLocation(){
    const { id } = useParams();
    const [warehouseId, setWarehouseId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post(`http://localhost:8000/api/stock/set-location/${id}`, { warehouseId });
        if (response.status === 200) {
            alert("Lokasi gudang berhasil ditambahkan");
            setWarehouseId('');
        }
    }

    

}