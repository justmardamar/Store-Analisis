import { useState } from "react";
import axios from "axios";


export default function CreateStore(){
    const [store,setStore] = useState({
        name:"",
        address:""
    })

    const handleInputChange = (e)=>{
        const {name,value} = e.target
        setStore({
            ...store,
            [name]:value,
        })
    }

    const handleCreateStore = async (e) => {
        e.preventDefault()
        const res = await axios.post("http://localhost:5000/api/store/create",store)
        if(res.data.message){
            console.log("Store created successfully")
        }else{
            console.log("Store creation failed")
        }
    }

    return(
        <form onSubmit={handleCreateStore}>
            <label htmlFor="">Name</label>
            <input type="text" name="name" onChange={handleInputChange} />

            <label htmlFor="">Address</label>
            <input type="text" name="address" onChange={handleInputChange} />

            <button type="submit">Create Store</button>
        </form>
    )
}