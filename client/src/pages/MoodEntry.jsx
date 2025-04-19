import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns'

export default function MoodEntry() {
    const { habits } = useAuth();
    const [mood, setMood] = useState('');
    const [dayRating, setDayRating] = useState(5);
    const [selectedHabits, setSelectedHabits] = useState([]);
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleHabitToggle = (habit) => {
        setSelectedHabits((prev) => 
            prev.includes(habit)
            ? prev.filter((h) => h !== habit)
            : [...prev, habit]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/moods', {
                mood,
                dayRating,
                habitsPracticed: selectedHabits,
                notes,
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save entry');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-4">New Mood Entry</h1>
            <p className="text-gray-600 mb-4">{format(new Date(), 'MMMM d, yyyy')}</p>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className='block mb-2 font-medium'>How are you feeling today?</label>
                    <div className="flex space-x-4">
                        {['happy', 'neutral', 'sad'].map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setMood(option)}
                                className={`px-4 py-2 rounded-full capitalize ${
                                    mood === option
                                        ? option === 'happy'
                                            ? 'bg-green-500 text-white'
                                            : option === 'neutral'
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-red-500 text-white'
                                        : 'bg-gray-200'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='mb-6'>
                    <label className="block mb-2 font-medium">
                        Rate your day (1-10): {dayRating}
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={dayRating}
                        onChange={(e) => setDayRating(parseIng(e.target.value))}
                        className="w-full"
                    />
                </div>

                {habits.length > 0 && (
                    <div className="mb-6">
                        <label className='block mb-2 font-medium'>Which habits did you practice today?</label>
                        <div className='space-y-2'>
                            {habits.map((habit) => (
                                <div key={habit} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={habit}
                                        checked={selectedHabits.includes(habit)}
                                        onChange={() => handleHabitToggle(habit)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={habit}>{habit}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className='mb-6'>
                    <label className="block mb-2 font-medium">Notes (optional)</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows="3"
                    />
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    >
                        Save Entry
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}