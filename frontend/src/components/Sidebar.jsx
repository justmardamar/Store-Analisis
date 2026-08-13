import { NavLink } from 'react-router-dom';

const roleMenus = {
  'Super Admin': [
    { label: 'Dashboard', to: '/' },
    { label: 'Toko', to: '/superAdmin/showStore' },
    { label: 'Supplier', to: '/superAdmin/showSupplier' },
    { label: 'Pengguna', to: '/superAdmin/createUser' },
  ],
  Admin: [
    { label: 'Dashboard', to: '/' },
    { label: 'Produk', to: '/admin/createProduct' },
    { label: 'Transaksi', to: '/admin/transaction' },
  ],
  kasir: [
    { label: 'Dashboard', to: '/' },
    { label: 'Transaksi', to: '/kasir/transaction' },
    { label: 'Buat Transaksi', to: '/kasir/transaction/create' },
  ],
  Stock: [
    { label: 'Dashboard', to: '/' },
    { label: 'Stock', to: '/stock/data-location' },
    { label: 'Gudang', to: '/stock/add-warehouse' },
    { label: 'Perubahan Stok', to: '/stock/change' },
  ],
};

export default function Sidebar() {
  const role = localStorage.getItem('role') || 'Admin';
  const menuItems = roleMenus[role] || roleMenus.Admin;

  return (
    <aside
      style={{
        width: '250px',
        minHeight: '100vh',
        background: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        padding: '24px 18px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '28px', padding: '10px 12px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: '#f3f4f6',
            color: '#4b5563',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          {role.charAt(0).toUpperCase()}
        </div>
        <div style={{ color: '#111827', fontSize: '17px', fontWeight: 700 }}>{role}</div>
        <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>Menu utama</div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#111827' : '#6b7280',
              background: isActive ? '#f3f4f6' : 'transparent',
              transition: 'all 0.2s ease',
            })}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#9ca3af',
                display: 'inline-block',
              }}
            />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}