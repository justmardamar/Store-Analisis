import {useState,useEffect} from 'react'
import axios from 'axios'

export default function ShowStore(){
    const [stores, setStores] = useState([])

    const fetchData = async () => {
        const response = await axios.get('http://localhost:5000/api/store')
        setStores(response.data)
    }

    useEffect(() => {
        fetchData()
    })

    return(
        <div className="">
            <h2>Daftar Store</h2>
            <a href="/superAdmin/createStore">Tambah Toko</a>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama</th>
                        <th>Alamat</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map((store) => (
                        <tr key={store.id}>
                            <td>{store.id}</td>
                            <td>{store.name}</td>
                            <td>{store.address}</td>
                            <td>{store.status}</td>
                            <td>
                                <a href={`/superAdmin/editStore/${store.id}`}>Update Toko</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}