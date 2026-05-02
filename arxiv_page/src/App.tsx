import { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardContent from './pages/dashboard/Dashboard';
import './App.css';
import EvaluationMetrics from './pages/metrics/EvaluationMetrics';

type Page = 'dashboard' | 'testing';

function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />

      <main className="main-content">
        {activePage === 'dashboard' && <DashboardContent />}
        {activePage === 'testing' && <EvaluationMetrics />}
      </main>
    </div>
  );
}

export default App;
