import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function SetLocation(){
    const { id } = useParams();
    const [warehouseId, setWarehouseId] = useState('');
    const [warehouses, setWarehouses] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post(`http://localhost:8000/api/stock/set-location/${id}`, { warehouseId });
        if (response.status === 200) {
            alert("Lokasi gudang berhasil ditambahkan");
            setWarehouseId('');
        }
    }

    const getWarehouseOptions = async () => {
        const response = await axios.get('http://localhost:8000/api/warehouse/store');
        setWarehouses(response.data);
    }

    useEffect(() => {
        getWarehouseOptions();
    }, []);

    return(
        <div className="">
            <h2>Tambah Lokasi Gudang</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="warehouse">Pilih Gudang:</label>
                <select id="warehouse" value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} required>
                    <option value="">-- Pilih Gudang --</option>
                    {warehouses.map((warehouse) => (
                        <option key={warehouse.id} value={warehouse.id}>
                            {warehouse.name} - {warehouse.location}
                        </option>
                    ))}
                </select>
                <button type="submit">Tambah Lokasi</button>
            </form>
        </div>
    )

}