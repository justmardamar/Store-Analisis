import Sidebar from '../../components/Sidebar';

export default function Dashboard() {
  const role = localStorage.getItem('role');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '32px 40px', color: '#374151' }}>
        <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '8px' }}>
          Role : {role}
        </div>
        <h1 style={{ margin: 0, color: '#111827', fontSize: '32px' }}>{role}</h1>
        <p style={{ marginTop: '12px', color: '#6b7280', fontSize: '16px' }}>
          Selamat datang di dashboard. Menu di samping menyesuaikan peran pengguna saat ini.
        </p>
      </main>
      {role === 'Super Admin' && (
        <div style={{ position: 'fixed', bottom: '16px', right: '16px', background: '#f9fafb', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>
          <a href="/superAdmin/createStore" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
            Create Store
          </a>
          <a href="/superAdmin/createUser" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500', marginLeft: '16px' }}>
            Create User Admin
          </a>
          <a href="/superAdmin/createSupplier" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500', marginLeft: '16px' }}>
            Create Supplier
          </a>
          <a href="/superAdmin/showStore" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500', marginLeft: '16px' }}>
            Show Store
          </a>
          <a href="/superAdmin/showSupplier" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500', marginLeft: '16px' }}>
            Show Supplier
          </a>
        </div>
      )}
      {role === "Admin" && (
        <div style={{ position: 'fixed', bottom: '16px', right: '16px', background: '#f9fafb', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>
          <a href="/admin/createProduct" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
            Create Product
          </a>
          <a href="/admin/transaction" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500', marginLeft: '16px' }}>
            List Transaction
          </a>
          <a href="/admin/createUser" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500', marginLeft: '16px' }}>
            Create User 
          </a>
          <a href="/stock/createDataStock" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500', marginLeft: '16px' }}>
            Create Data Stock
          </a>
          <a href="/stock/data-location" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500', marginLeft: '16px' }}>
            Update Data Stock
          </a>
        </div>
      )}
      {role === "Kasir" && (
        <div style={{ position: 'fixed', bottom: '16px', right: '16px', background: '#f9fafb', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>
          <a href="/kasir/transaction" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
            Show Transaction
          </a>
          <a href="/kasir/transaction/create" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500', marginLeft: '16px' }}>
            Create Transaction
          </a>
        </div>
      )}
      {role === "Stock" && (
        <div style={{ position: 'fixed', bottom: '16px', right: '16px', background: '#f9fafb', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>
          <a href="/stock/createDataStock" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
            Create Data Stock
          </a>
          <a href="/stock/data-location" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500', marginLeft: '16px' }}>
            Update Data Stock
          </a>
          <a href="/stock/warehouses" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500', marginLeft: '16px' }}>
            Show Warehouses
          </a>
          <a href="/stock/add-warehouse" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500', marginLeft: '16px' }}>
            Add Warehouse
          </a>
          <a href="/stock/change" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500', marginLeft: '16px' }}>
            Change Stock
          </a>
        </div>
      )}
    </div>
  );
}