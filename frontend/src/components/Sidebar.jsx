import { NavLink } from 'react-router-dom';

const roleMenus = {
  'Super Admin': [
    { label: 'Dashboard', to: '/' },
    { label: 'Toko', to: '/superAdmin/showStore' },
    { label: 'Supplier', to: '/superAdmin/showSupplier' },
    { label: 'User Admin', to: '/superAdmin/showUser' },
  ],
  'Admin': [
    { label: 'Dashboard', to: '/' },
    { label: 'Produk', to: '/admin/listProduct' },
    { label: 'Transaksi', to: '/admin/transaction' },
    { label: 'User', to: '/admin/listUser' },
    { label: 'Alokasi Stok', to: '/admin/createDataStock' },
  ],
  'kasir': [
    { label: 'Dashboard', to: '/' },
    { label: 'Transaksi', to: '/kasir/transaction' },
    { label: 'Buat Transaksi', to: '/kasir/transaction/create' },
  ],
  'Stock': [
    { label: 'Dashboard', to: '/' },
    { label: 'Stock', to: '/stock/data-location' },
    { label: 'Gudang', to: '/stock/warehouses' },
    { label: 'Perubahan Stok', to: '/stock/change' },
  ],
};

export default function Sidebar() {
  const role = localStorage.getItem('role') || 'Admin';
  const menuItems = roleMenus[role] || roleMenus.Admin;

  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-white px-5 py-5 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:px-4 lg:py-7">
      <div className="mb-8 flex items-center gap-3 px-2 lg:block">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-lg font-bold text-white shadow-sm">
          S
        </div>
        <div className="lg:mt-4">
          <div className="text-base font-bold tracking-tight text-slate-900">Storewise</div>
          <div className="mt-0.5 text-xs text-slate-500">{role} workspace</div>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto lg:flex-col">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive ? 'bg-teal-50 font-semibold text-teal-800' : 'font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}