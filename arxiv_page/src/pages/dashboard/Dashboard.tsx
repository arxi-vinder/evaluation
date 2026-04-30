import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import './Dashboard.css';

type ApiResponse = {
  user_id: number;
  k1: number;
  k3: number;
  k5: number;
};

type User = {
  id: number;
  name: string;
  k1: number;
  k5: number;
  k10: number;
};

const DashboardContent = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/evaluation/f1")
      .then(res => res.json())
      .then((data: ApiResponse[]) => {
        const mapped: User[] = data.map((item) => ({
          id: item.user_id,
          name: `User ${item.user_id}`,
          k1: item.k1,
          k5: item.k3,  
          k10: item.k5
        }));

        setUsers(mapped);
      })
      .catch((err: unknown) => console.error(err));
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* Card */}
      <div className="stat-card">
        <div className="stat-info">
          <p>Total User</p>
          <h3>{users.length}</h3>
        </div>

        <div className="stat-icon-wrapper">
          <Users size={28} strokeWidth={2.5} />
        </div>
      </div>

      {/* Table */}
      <div className="table-section">
        <h3 className="table-title">Metrik Evaluasi Precision</h3>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Nama Pengguna</th>
              <th>Email</th>
              <th>K = 1</th>
              <th>K = 5</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="user-cell">
                  <div className="avatar"></div>
                  {user.name}
                </td>
                <td>{user.k1.toFixed(2)}</td>
                <td>{user.k5.toFixed(2)}</td>
                <td>{user.k10.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardContent;