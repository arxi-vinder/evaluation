import './Sidebar.css';
import { Gauge, Power } from 'lucide-react';

const Sidebar = () => {
return (
    <aside className="sidebar">
      {/* Bagian Logo */}
        <div className="sidebar-header">
            <h1>arxi.vinder</h1>
        </div>

        <div className="sidebar-divider" />

        {/* Bagian Navigasi Tengah */}
        <nav className="sidebar-nav">
            <button className="nav-item">
            <Gauge size={20} strokeWidth={2.5} />
            <span>Dashboard</span>
            </button>
        </nav>

        <div className="sidebar-divider" />

        {/* Bagian Bawah (Logout) */}
        <div className="sidebar-footer">
            <button className="logout-btn">
            <Power size={24} strokeWidth={2} />
            <span>Logout</span>
            </button>
        </div>
        </aside>
);
};

export default Sidebar;