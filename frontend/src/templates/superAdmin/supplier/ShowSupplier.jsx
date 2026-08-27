import {useState, useEffect} from 'react';
import axios from 'axios';

export default function ShowSupplier(){
    const [supplier, setSupplier] = useState([])

    const fetchSupplier = async () => {
        const response = await axios.get('http://localhost:5000/api/supplier')
        setSupplier(response.data)
    }

    useEffect(() => {
        fetchSupplier()
    }, [])

    return(
        <div className="">
            <a href="/superAdmin/createSupplier" className="btn btn-primary">Tambah Supplier</a>
            <table>
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Nomor Handphone</th>
                        <th>Alamat</th>
                    </tr>
                </thead>
                <tbody>
                    {supplier.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.phoneNumber}</td>
                            <td>{item.address}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}