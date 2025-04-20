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
                console.log("Fetched analytics data:", res.data);
            } catch (err) {
                console.error("Error fetching analytics:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    console.log("Analytics data:", analytics);
    if (loading) return <div className='p-4'>Loading analytics...</div>;
    if (!analytics || analytics.totalEntries === 0) return <div>No analytics data available. Start logging moods to see your analytics.</div>;

    const habitImpactData = analytics.habitImpact || {};

    // Prepare habit data, include all habits with their impact or zero
    const habitImpactWithAllHabits = habits ? habits.reduce((acc, habit) => {
        acc[habit] = habitImpactData[habit] || 0;
        return acc;
    }, {}) : {};

    const moodData = {
        labels: Object.keys(analytics.moodFrequency || {}),
        datasets: [
            {
                label: 'Mood Frequency',
                data: Object.values(analytics.moodFrequency || {}),
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
            },
        ],
    };

    const habitData = {
        labels: Object.keys(habitImpactWithAllHabits), // Use all habits from user context
        datasets: [
            {
                label: 'Average Day Rating',
                data: Object.values(habitImpactWithAllHabits),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
        ],
    };

    // Find most frequent mood
    const moodFrequencyEntries = Object.entries(analytics.moodFrequency || {});
    const mostFrequentMood = moodFrequencyEntries.length > 0
        ? moodFrequencyEntries.reduce((prev, current) =>
        (current[1] > prev[1] ? current : prev))[0] : 'N/A';

    return (
        <div>
            <h1 className='text-2xl font-bold mb-6'>Your Mood Analytics</h1>
            <div className='grid md:grid-cols-2 gap-6 mb-8'>
                <div className='bg-white p-4 rounded shadow'>
                    <h2 className="text-xl font-semibold mb-4">Mood Distribution</h2>
                    {Object.keys(analytics.moodFrequency || {}).length > 0 ? (
                        <div className='h-64'>
                            <Pie data={moodData} options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }} />
                        </div>
                    ) : (
                        <p>No mood data available.</p>
                    )}
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-4">Habit Impact on Day Rating</h2>
                    {habits && habits.length > 0 ? (
                        <div className='h-64'>
                            <Bar
                                data={habitData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            max: 10,
                                        },
                                    },
                                }}
                            />
                        </div>
                    ) : (
                        <p>No habit data available. Set up habits and log them to see impact.</p>
                    )}
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow mb-6">
                <h2 className='text-xl font-semibold mb-4'>Summary</h2>
                <div className='grid grid-cols-3 gap-4'>
                    <div className='text-center'>
                        <p className="text-3xl font-bold">{(analytics.avgRating || 0).toFixed(1)}</p>
                        <p className="text-gray-600">Avg. Day Rating</p>
                    </div>
                    <div className='text-center'>
                        <p className="text-3xl font-bold">{analytics.totalEntries || 0}</p>
                        <p className="text-gray-600">Total Entries</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold">
                           {mostFrequentMood || 'N/A'}
                        </p>
                        <p className="text-gray-600">Most Frequent Mood</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Habit Insights</h2>
                {Object.keys(habitImpactWithAllHabits).length > 0 ? (
                    <ul className="space-y-2">
                        {Object.entries(habitImpactWithAllHabits).map(([habit, rating]) => (
                            <li key={habit} className="flex justify-between">
                                <span>{habit}</span>
                                <span className="font-medium">{(rating || 0).toFixed(1)} avg. rating</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No habits tracked yet.</p>
                )}
            </div>
        </div>
    );
}