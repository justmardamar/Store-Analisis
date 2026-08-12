import {Routes,Route,BrowserRouter} from 'react-router-dom'
import Login from './templates/auth/Login'
import Dashboard from './templates/dashboard/Dashboard'

import CreateProduct from './templates/admin/product/CreateProduct'
import ListTransaction from './templates/admin/transaction/ListTransaction'
import DetailTransaction from './templates/admin/transaction/DetailTransaction'
import LoginAuthRoute from './components/LoginAuthRoute'
import CreateStore from './templates/superAdmin/store/CreateStore'
import EditStore from './templates/superAdmin/store/EditStore'
import ShowStore from './templates/superAdmin/store/ShowStore'
import CreateUser from './templates/superAdmin/user/CreateUser'
import SetLocation from './templates/stock/NewStock/SetLocation'

import ChangeStock from './templates/stock/NewStock/ChangeStock'

import ShowTransaction from './templates/kasir/transaction/ShowTransaction'
import CreateTransaction from './templates/kasir/transaction/CreateTransaction'
import UpdateStockData from './templates/stock/NewStock/UpdateStockData'
import AddWarehouse from './templates/stock/warehouse/AddWarehouse'


function App() {

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <BrowserRouter>
        {/* Commented out Navbar and Footer because they are not defined yet */}
        {/* <Navbar /> */}
        <Routes>
          {/* Halaman Login harus berada di luar LoginAuthRoute agar bisa diakses publik */}
          <Route path="/login" element={<Login />} />

          {/* Halaman yang diproteksi (wajib login) */}
          <Route element={<LoginAuthRoute/>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin/createProduct" element={<CreateProduct />} />
            <Route path="/admin/transaction" element={<ListTransaction />} />
            <Route path="/admin/transaction/:id" element={<DetailTransaction />} />
            <Route path='/superAdmin/createStore' element={<CreateStore/>} />
            <Route path='/superAdmin/editStore/:id' element={<EditStore/>} />
            <Route path='/superAdmin/showStore' element={<ShowStore/>} />
            <Route path='/superAdmin/createUser' element={<CreateUser/>} />
            <Route path='/kasir/transaction' element={<ShowTransaction/>} />
            <Route path='/kasir/transaction/create' element={<CreateTransaction/>} />
            <Route path='/stock/data-location' element={<UpdateStockData/>} />
            <Route path='/stock/change' element={<ChangeStock/>} />
            <Route path='/stock/set-location/:id' element={<SetLocation/>} />
            <Route path='/stock/add-warehouse' element={<AddWarehouse/>} />
          </Route>
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>  
  )
}

export default App
