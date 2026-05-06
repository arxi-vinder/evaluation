import { useEffect, useState } from 'react';
import '../dashboard/Dashboard.css';
import { LineChart } from '@mui/x-charts/LineChart';

type ApiResponse = {
    user_id: number;
    k1: number;
    k3: number;
    k5: number;
};

const normalizeArray = (data: any): ApiResponse[] => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
};

const calculateAverage = (data: ApiResponse[]) => {
    if (data.length === 0) return [0, 0, 0];

    const avgK1 = data.reduce((s, d) => s + (d.k1 ?? 0), 0) / data.length;
    const avgK3 = data.reduce((s, d) => s + (d.k3 ?? 0), 0) / data.length;
    const avgK5 = data.reduce((s, d) => s + (d.k5 ?? 0), 0) / data.length;

    return [avgK1, avgK3, avgK5];
    };

    const Chart = () => {
    const [precision, setPrecision] = useState<number[]>([0, 0, 0]);
    const [f1, setF1] = useState<number[]>([0, 0, 0]);
    const [recall, setRecall] = useState<number[]>([0, 0, 0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
        try {
            const [pRes, fRes, rRes] = await Promise.all([
            fetch("http://localhost:8000/api/v1/evaluation/precision"),
            fetch("http://localhost:8000/api/v1/evaluation/f1"),
            fetch("http://localhost:8000/api/v1/evaluation/recall"),
            ]);

            const pJson = await pRes.json();
            const fJson = await fRes.json();
            const rJson = await rRes.json();

            setPrecision(calculateAverage(normalizeArray(pJson)));
            setF1(calculateAverage(normalizeArray(fJson)));
            setRecall(calculateAverage(normalizeArray(rJson)));

        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
        };

        fetchAll();
    }, []);

    return (
        <div className="dashboard-container">
        <h2 className="dashboard-title">Chart Metrics</h2>

        {loading ? (
            <p>Loading chart...</p>
        ) : (
            <div style={{
            width: '100%',
            background: '#fff',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
            <LineChart
                height={500}
                margin={{ top: 40, right: 40, bottom: 50, left: 60 }}

                xAxis={[
                {
                    scaleType: 'point',
                    data: ['K=1', 'K=3', 'K=5'],
                    label: 'Top-K Recommendation',
                },
                ]}

                yAxis={[
                {
                    label: 'Metric Value',
                    min: 0,
                    max: 1,
                },
                ]}

                series={[
                {
                    data: precision,
                    label: 'Precision',
                    showMark: true,
                    curve: 'linear',
                },
                {
                    data: f1,
                    label: 'F1 Score',
                    showMark: true,
                    curve: 'linear',
                },
                {
                    data: recall,
                    label: 'Recall',
                    showMark: true,
                    curve: 'linear',
                },
                ]}

                grid={{ vertical: true, horizontal: true }}

                slotProps={{
                legend: {
                    position: { vertical: 'top', horizontal: 'end' },
                },
                }}
            />
            </div>
        )}
        </div>
    );
};

export default Chart;