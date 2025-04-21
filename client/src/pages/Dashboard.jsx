import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Dashboard() {
    const { user } = useAuth();
    const [entries, setEntries] = useState([]);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const res = await axios.get('/api/moods');
                setEntries(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEntries();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className='flex justify-between items-center mb-6'>
                <h1 className="text-2xl font-bold">Your Mood Journal</h1>
                <Link
                    to="/entry"
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                    Add New Entry
                </Link>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
                {entries.length === 0 ? (
                    <p>No entries yet. Add your first entry!</p>
                ) : (
                    <div className='space-y-4'>
                        {entries.slice(0, 5).map((entry) => (
                            <div key={entry._id} className='p-4 bg-white rounded shadow'>
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <h3 className="font-medium">
                                            {format(new Date(entry.date), 'MMMM d, yyyy')}
                                        </h3>
                                        <p className='capitalize'>Mood: {entry.mood}</p>
                                        <p>Rating: {entry.dayRating}/10</p>
                                        {entry.habitsPracticed.length > 0 && (
                                            <p>Habits: {entry.habitsPracticed.join(', ')}</p>
                                        )}
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                            entry.mood === 'happy'
                                                ? 'bg-green-100 text-green-800'
                                                : entry.mood === 'neutral'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {entry.mood}
                                    </span>
                                </div>
                                {entry.notes && (
                                    <div className="mt-2 p-2 bg-gray-50 rounded">
                                        <p className='text-sm'>{entry.notes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mb-4">
                <Link
                    to="/analytics"
                    className="text-yellow-500 hover:underline"
                >
                    View Analytics →
                </Link>
            </div>
        </div>
    );
}