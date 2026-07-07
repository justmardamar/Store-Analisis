import axios from "axios";
import { useEffect, useState } from "react";

export default function UpdateStockData(){
    const [updates,setUpdate] = useState([])

    const fetchData = async () => {
        const res = await axios.get('http://localhost:8000/api/stock/updateWarehouse')
        setUpdate(res)
    }
    useEffect(() => {
        fetchData()
    },[])

    return(
        <div className="">
            {updates ? 
            <div className="">
                
            </div> 
            : 'Belum ada data stock yang ditambahkan'}
        </div>
    )
}