

export default function Dashboard() {
  
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  
  const checkLoginStatus = () => {
    if (!isLoggedIn) {
      window.location.href = '/login';
    }
  }

  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Overview</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Good morning, {username}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Pantau operasional toko dan kelola aktivitas harian dari satu tempat.</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500">Today · Store operations</div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['Active products', '128', '+12% this month'],
            ['Today’s transactions', '42', '+8.4% from yesterday'],
            ['Low stock items', '07', 'Needs attention'],
          ].map(([label, value, note], index) => (
            <div className="surface p-5" key={label}>
              <div className="mb-5 flex items-center justify-between"><span className="text-sm font-medium text-slate-500">{label}</span><span className={`h-2 w-2 rounded-full ${index === 2 ? 'bg-amber-500' : 'bg-teal-600'}`} /></div>
              <div className="text-3xl font-bold tracking-tight text-slate-900">{value}</div>
              <div className="mt-2 text-xs font-medium text-slate-500">{note}</div>
            </div>
          ))}
        </div>
        <div className="surface mt-5 p-6">
          <p className="text-sm font-semibold text-slate-900">Quick start</p>
          <p className="mt-1 text-sm text-slate-500">Choose an item from the navigation to continue managing your store.</p>
        </div>
      </div>
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
          <a href="/admin/createDataStock" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500', marginLeft: '16px' }}>
            Create Data Stock
          </a>
          <a href="/stock/data-location" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500', marginLeft: '16px' }}>
            Update Data Stock
          </a>
        </div>
      )}
      {role === "kasir" && (
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
          <a href="/admin/createDataStock" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
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