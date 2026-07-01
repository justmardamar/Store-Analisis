import { useState } from "react"
import axios from "axios"

export default function Login(){
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
        if(res.data.message){
            console.log("Login success")
        }else{
            console.log("Login failed")
        }
    }

    return (
        <>
            <form onSubmit={handleLogin}>
                <label htmlFor="">Email</label>
                <input type="text" name="email" onChange={handleInputChange} />

                <label htmlFor="">Password</label>
                <input type="password" name="password" onChange={handleInputChange} />
                <button type="submit">Login</button>
            </form>
        </>
    )
}
