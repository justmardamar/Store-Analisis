import Sidebar from '../../components/Sidebar';

export default function Dashboard() {
  const role = localStorage.getItem('role') || 'Admin';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '32px 40px', color: '#374151' }}>
        <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '8px' }}>
          Role access
        </div>
        <h1 style={{ margin: 0, color: '#111827', fontSize: '32px' }}>{role}</h1>
        <p style={{ marginTop: '12px', color: '#6b7280', fontSize: '16px' }}>
          Selamat datang di dashboard. Menu di samping menyesuaikan peran pengguna saat ini.
        </p>
      </main>
    </div>
  );
}