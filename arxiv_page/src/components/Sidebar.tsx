import './sidebar.css';
import { Gauge, FlaskConical, BarChart } from 'lucide-react';

type Page = 'dashboard' | 'testing' | 'chart';

type SidebarProps = {
    activePage: Page;
    onPageChange: (page: Page) => void;
};

const Sidebar = ({ activePage, onPageChange }: SidebarProps) => {
    return (
        <aside className="sidebar">
        <div className="sidebar-header">
            <h1>arxi.vinder</h1>
        </div>

        <div className="sidebar-divider" />

        <nav className="sidebar-nav">
            <button
            className={`nav-item ${activePage === 'dashboard' ? 'active' : 'inactive'}`}
            onClick={() => onPageChange('dashboard')}
            >
            <Gauge size={20} strokeWidth={2.5} />
            <span>F1 Score</span>
            </button>

            <button
            className={`nav-item ${activePage === 'testing' ? 'active' : 'inactive'}`}
            onClick={() => onPageChange('testing')}
            >
            <FlaskConical size={20} strokeWidth={2.5} />
            <span>Evaluation Tab</span>
            </button>

            <button
            className={`nav-item ${activePage === 'chart' ? 'active' : 'inactive'}`}
            onClick={() => onPageChange('chart')}
            >
            <BarChart size={20} strokeWidth={2.5} />
            <span>Chart Tab</span>
            </button>
        </nav>

        <div className="sidebar-divider" />
        </aside>
    );
};

export default Sidebar;