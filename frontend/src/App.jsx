import { useState,useEffect } from 'react'
import axios from 'axios'

function App() {
  const [message,setMessage] = useState({})

  async function getData() {
    const { data } = await axios.get('/api/data')
    setMessage(data)
  }

  useEffect(()=>{
    getData()
  },[])

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>React + Flask Integration</h1>
      <p>{message.message}</p>
      <p>{message.status}</p>
    </div>  
  )
}

export default App
