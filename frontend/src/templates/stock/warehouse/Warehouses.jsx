import {useState, useEffect} from 'react'

export default function Warehouses(){
    const [warehouses, setWarehouses] = useState([])

    const fetchData = async () => {
        const response = await fetch('http://localhost:5000/api/warehouse')
        const data = await response.json()
        setWarehouses(data)
    }

    useEffect(() => {
        fetchData()
    },[])
    return(
        <div className="">
            <Link to="/stock/add-warehouse">Tambah Warehouse</Link>
            <h2>Daftar Warehouse</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Lokasi</th>
                    </tr>
                </thead>
                <tbody>
                    {warehouses.map((warehouse) => (
                        <tr key={warehouse.id}>
                            <td>{warehouse.id}</td>
                            <td>{warehouse.location}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}