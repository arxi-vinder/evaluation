import Sidebar from './components/Sidebar';
import DashboardContent from './pages/dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />

      <main className="main-content">
        <DashboardContent />
      </main>
    </div>
  );
}

export default App;