import { useEffect, useRef, useState } from 'react';
import { Users, Plus, X, CheckCircle } from 'lucide-react';
import './Dashboard.css';

type MAPUser = {
  id: number;
  name: string;
  ap: number;
};

type MAPData = {
  mean: number;
  map1: number;
  map3: number;
  map5: number;
  users: MAPUser[];
};

type PaperForm = {
  title: string;
  abstract: string;
  published_date: string;
  category: string;
  url: string;
  author: string;
};

const EMPTY_FORM: PaperForm = {
  title: '',
  abstract: '',
  published_date: '',
  category: '',
  url: '',
  author: '',
};

const mapMAPData = (data: any): MAPData => ({
  mean: data?.mean_average_precision ?? 0,
  map1: data?.map_at_k?.["map@1"] ?? 0,
  map3: data?.map_at_k?.["map@3"] ?? 0,
  map5: data?.map_at_k?.["map@5"] ?? 0,
  users: (data?.average_precision_per_user || []).map((item: any) => ({
    id: item.user_id,
    name: `User ${item.user_id}`,
    ap: item.average_precision ?? 0,
  })),
});

const DashboardContent = () => {
  const [mapDataState, setMapDataState] = useState<MAPData>({
    mean: 0, map1: 0, map3: 0, map5: 0, users: [],
  });
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<PaperForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/evaluation/mape");
        const data = await res.json();
        setMapDataState(mapMAPData(data));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMap();
  }, []);

  const openModal = () => {
    setForm(EMPTY_FORM);
    setSuccessId(null);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) closeModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    setSuccessId(null);

    const body = {
      ...form,
      published_date: form.published_date ? `${form.published_date}T00:00:00` : '',
    };

    try {
      const res = await fetch("http://localhost:8000/api/v1/create/paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (json.status === "success") {
        setSuccessId(json.data.id);
        setForm(EMPTY_FORM);
      } else {
        setErrorMsg(json.message ?? "Terjadi kesalahan, coba lagi.");
      }
    } catch {
      setErrorMsg("Gagal terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">

      <div className="dashboard-header-row">
        <h2 className="dashboard-title">Evaluation Dashboard</h2>
        <button className="add-paper-btn" onClick={openModal}>
          <Plus size={18} strokeWidth={2.5} />
          <span>Tambah Paper</span>
        </button>
      </div>

      {loading && <p>Loading data...</p>}

      <div className="stat-card">
        <div className="stat-info">
          <p>Total User</p>
          <h3>{mapDataState.users.length}</h3>
        </div>
        <div className="stat-icon-wrapper">
          <Users size={28} strokeWidth={2.5} />
        </div>
      </div>

      <div className="table-section">
        <h3 className="table-title">Mean Average Precision</h3>
        <div className="stat-card">
          <div className="stat-info">
            <p>MAP Score</p>
            <h3>{mapDataState.mean.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <div className="table-section">
        <h3 className="table-title">MAP @ K</h3>
        <table className="custom-table">
          <thead>
            <tr>
              <th>MAP@1</th>
              <th>MAP@3</th>
              <th>MAP@5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{mapDataState.map1.toFixed(2)}</td>
              <td>{mapDataState.map3.toFixed(2)}</td>
              <td>{mapDataState.map5.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="table-section">
        <h3 className="table-title">Average Precision per User</h3>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nama Pengguna</th>
              <th>Average Precision</th>
            </tr>
          </thead>
          <tbody>
            {mapDataState.users.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ textAlign: "center" }}>No data</td>
              </tr>
            ) : (
              mapDataState.users.map((user) => (
                <tr key={user.id}>
                  <td className="user-cell">
                    <div className="avatar"></div>
                    {user.name}
                  </td>
                  <td>{user.ap.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
          <div className="modal-box">

            <div className="modal-header">
              <h3>Tambah Paper Baru</h3>
              <button className="modal-close-btn" onClick={closeModal} disabled={submitting}>
                <X size={20} />
              </button>
            </div>

            {successId !== null ? (
              <div className="modal-success">
                <CheckCircle size={48} strokeWidth={1.5} />
                <p className="modal-success-title">Data berhasil dibuat!</p>
                <p className="modal-success-sub">Paper tersimpan dengan ID <strong>#{successId}</strong>.</p>
                <button className="modal-done-btn" onClick={closeModal}>Tutup</button>
              </div>
            ) : (
              <form className="modal-form" onSubmit={handleSubmit}>

                <div className="form-group">
                  <label>Judul</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Attention Is All You Need"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Abstract</label>
                  <textarea
                    name="abstract"
                    value={form.abstract}
                    onChange={handleChange}
                    placeholder="Deskripsi singkat paper..."
                    rows={4}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tanggal Publikasi</label>
                    <input
                      type="date"
                      name="published_date"
                      value={form.published_date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Kategori</label>
                    <input
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      placeholder="Machine Learning (cs.LG)"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>URL</label>
                  <input
                    name="url"
                    type="url"
                    value={form.url}
                    onChange={handleChange}
                    placeholder="https://arxiv.org/abs/..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Author</label>
                  <input
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    placeholder="Vaswani, Ashish and Shazeer, Noam"
                    required
                  />
                </div>

                {errorMsg && <p className="modal-error">{errorMsg}</p>}

                <div className="modal-actions">
                  <button type="button" className="modal-cancel-btn" onClick={closeModal} disabled={submitting}>
                    Batal
                  </button>
                  <button type="submit" className="modal-submit-btn" disabled={submitting}>
                    {submitting ? "Menyimpan..." : "Simpan Paper"}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardContent;
