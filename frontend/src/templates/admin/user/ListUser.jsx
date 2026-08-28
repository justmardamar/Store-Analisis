import {useState, useEffect} from 'react'
import axios from 'axios'

export default function ListUser(){
    const [users, setUsers] = useState([])

    const fetchData = async () => {
        const response = await axios.get('http://localhost:5000/api/users')
        setUsers(response.data.users)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return(
        <div className="">
            <h2>Daftar User</h2>
            <a href="/admin/createUser">Tambah User</a>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {users?.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <a href={`/admin/editUser/${user.id}`}>Update User</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}