import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function Analytics() {
    const { habits } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get('/api/moods/analytics');
                setAnalytics(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) return <div>Loading analytics...</div>;
    if (!analytics) return <div>No analytics data available</div>;

    const moodData = {
        labels: Object.keys(analytics.moodFrequency),
        datasets: [
            {
                label: 'Mood Frequency',
                data: Object.values(analytics.moodFrequency),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
            },
        ],
    };

    const habitData = {
        labels: Object.keys(analytics.habitImpact),
        datasets: [
            {
                label: 'Average Day Rating',
                data: Object.values(analytics.habitImpact),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
        ],
    };

    return (
        <div>
            <h1 className='text-2xl font-bold mb-6'>Your Mood Analytics</h1>
            <div className='grid md:grid-cols-2 gap-6 mb-8'>
                <div className='bg-white p-4 rounded shadow'>
                    <h2 className="text-xl font-semibold mb-4">Mood Distribution</h2>
                    <div className='h-64'>
                        <Pie data={moodData} />
                    </div>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Habit Impact on Day Rating</h2>
                    <div className='h-64'>
                        <Bar
                            data={habitData}
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: 10,
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow mb-6">
                <h2 className='text-xl font-semibold mb-4'>Summary</h2>
                <div className='grid grid-cols-3 gap-4'>
                    <div className='text-center'>
                        <p className="text-3xl font-bold">{analytics.avgRating.toFixed(1)}</p>
                        <p className="text-gray-600">Avg. Day Rating</p>
                    </div>
                    <div className='text-center'>
                        <p className="text-3xl font-bold">{analytics.totalEntries}</p>
                        <p className="text-gray-600">Total Entries</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold">
                            {Math.max(...Object.values(analytics.moodFrequency))}
                        </p>
                        <p className="text-gray-600">Most Frequent Mood</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Habit Insights</h2>
                <ul className="space-y-2">
                    {Object.entries(analytics.habitImpact).map(([habit, rating]) => (
                        <li key={habit} className="flex justify-between">
                            <span>{habit}</span>
                            <span className="font-medium">{rating.toFixed(1)} avg. rating</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}