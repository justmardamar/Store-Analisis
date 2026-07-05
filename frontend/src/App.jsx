import { useState,useEffect } from 'react'

import {Routes,Route,BrowserRouter} from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/admin/Admin'

function App() {

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/transaction/{id}" element={<DetailTransaction />} />
        </Routes>
        <Footer />
      </BrowserRouter>
      <p>{message.status}</p>
    </div>  
  )
}

export default App
