import { useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [habits, setHabits] = useState(['Exercise', 'Meditation', 'Healthy Eating']);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({ email, password, habits });
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded shadow'>
            <h1 className="text-2x1 font-bold mb-4">Register</h1>
            {error && <div className='text-red-500 mb-4'>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label className='block mb-2'>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full p-2 border rounded'
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className="block mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block mb-2'>Habits to Track</label>
                    <div className='space-y-2'>
                        {habits.map((habit, index) => (
                            <div key={index} className='flex items-center'>
                                <input
                                    type="text"
                                    value={habit}
                                    onChange={(e) => {
                                        const newHabits = [...habits];
                                        newHabits[index] = e.target.value;
                                        setHabits(newHabits);
                                    }}
                                    className="flex-1 p-2 border rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newHabits = [...habits];
                                        newHabits.splice(index, 1);
                                        setHabits(newHabits);
                                    }}
                                    className='ml-2 text-red-500'
                                >
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => setHabits([...habits, ''])}
                        className='mt-2 text-sm text-blue-500'
                    >
                        + Add Habit
                    </button>
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Register
                </button>
            </form>
            <p className='mt-4 text-center'>
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="text-blue-500">
                    Login
                </button>
            </p>
        </div>
    );
}