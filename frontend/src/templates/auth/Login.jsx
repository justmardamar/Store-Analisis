import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"


export default function Login(){
    const navigate = useNavigate()
    const [login,setLoginData] = useState({
        email: "",
        password: "",
    })
    const handleInputChange = (e) => {
        const {name,value} = e.target
        setLoginData({
            ...login,
            [name]:value,
        })
    }
    const handleLogin = async (e) =>{
        e.preventDefault()
        const res = await axios.post("http://localhost:5000/api/login",login)
        console.log(res)
        if(res.data.isLoggedIn){
            if(res.data.role === 'Super Admin'){
                localStorage.setItem('token', true)
                localStorage.setItem('role', 'Super Admin')
                
            }
            if(res.data.role === 'Admin'){
                localStorage.setItem('token', true)
                localStorage.setItem('role', 'Admin')
            }
            if(res.data.role === 'kasir'){
                localStorage.setItem('token', true)
                localStorage.setItem('role', 'kasir')
            }
            if(res.data.role === 'Stock'){
                localStorage.setItem('token', true)
                localStorage.setItem('role', 'Stock')
            }
            navigate('/dashboard')
        }else{
            console.log("Login failed")
        }
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <label htmlFor="">Email</label>
                <input type="text" name="email" onChange={handleInputChange} />

                <label htmlFor="">Password</label>
                <input type="password" name="password" onChange={handleInputChange} />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
