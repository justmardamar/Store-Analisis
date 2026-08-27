import {Routes,Route,BrowserRouter} from 'react-router-dom'
import Login from './templates/auth/Login'
import Dashboard from './templates/dashboard/Dashboard'

import LoginAuthRoute from './components/LoginAuthRoute'
import AppShell from './components/AppShell'

import CreateProduct from './templates/admin/product/CreateProduct'
import ListTransaction from './templates/admin/transaction/ListTransaction'
import DetailTransaction from './templates/admin/transaction/DetailTransaction'
import CreateUser from './templates/admin/user/CreateUser'
import CreateDataStock from './templates/admin/stocks/CreateDataStock'

import CreateStore from './templates/superAdmin/store/CreateStore'
import EditStore from './templates/superAdmin/store/EditStore'
import ShowStore from './templates/superAdmin/store/ShowStore'
import CreateUserAdmin from './templates/superAdmin/user/CreateUserAdmin'
import ShowSupplier from './templates/superAdmin/supplier/ShowSupplier'
import CreateSupplier from './templates/superAdmin/supplier/CreateSupplier'


import ShowTransaction from './templates/kasir/transaction/ShowTransaction'
import CreateTransaction from './templates/kasir/transaction/CreateTransaction'

import SetLocation from './templates/stock/NewStock/SetLocation'
import ChangeStock from './templates/stock/NewStock/ChangeStock'
import UpdateStockData from './templates/stock/NewStock/UpdateStockData'
import AddWarehouse from './templates/stock/warehouse/AddWarehouse'
import Warehouses from './templates/stock/warehouse/Warehouses'


function App() {

  return (
    <div>
      <BrowserRouter>
        {/* Commented out Navbar and Footer because they are not defined yet */}
        {/* <Navbar /> */}
        <Routes>
          {/* Halaman Login harus berada di luar LoginAuthRoute agar bisa diakses publik */}
          <Route path="/login" element={<Login />} />

          {/* Halaman yang diproteksi (wajib login) */}
          <Route element={<LoginAuthRoute/>}>
            <Route element={<AppShell />}>
            <Route path="/" element={<Dashboard />} />

            <Route path="/admin/createProduct" element={<CreateProduct />} />
            <Route path="/admin/transaction" element={<ListTransaction />} />
            <Route path="/admin/transaction/:id" element={<DetailTransaction />} />
            <Route path="/admin/createUser" element={<CreateUser />} />
            <Route path="/admin/createDataStock" element={<CreateDataStock />} />

            <Route path='/superAdmin/createStore' element={<CreateStore/>} />
            <Route path='/superAdmin/editStore/:id' element={<EditStore/>} />
            <Route path='/superAdmin/showStore' element={<ShowStore/>} />
            <Route path='/superAdmin/createUser' element={<CreateUserAdmin/>} />
            <Route path='/superAdmin/showSupplier' element={<ShowSupplier/>} />
            <Route path='/superAdmin/createSupplier' element={<CreateSupplier/>} />

            <Route path='/kasir/transaction' element={<ShowTransaction/>} />
            <Route path='/kasir/transaction/create' element={<CreateTransaction/>} />

            <Route path='/stock/data-location' element={<UpdateStockData/>} />
            <Route path='/stock/change' element={<ChangeStock/>} />
            <Route path='/stock/set-location/:id' element={<SetLocation/>} />
            <Route path='/stock/warehouses' element={<Warehouses/>} />
            <Route path='/stock/add-warehouse' element={<AddWarehouse/>} />
            </Route>
          </Route>
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>  
  )
}

export default App
