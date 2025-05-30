import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password });
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded shadow'>
            <div className='flex items-center mb-6'>
                <img src="lemon.gif" alt="Lemon Logo" className='w-12 h-12 object-contain' />
            </div>
            <div className='mb-6 text-left'>
                <h1 className="text-3xl font-normal text-[#1f1f1f] mb-1">Sign in</h1>
                <h2 className="font-normal text-[#1f1f1f] text-base">to continue to Mood</h2>
            </div>
            {error && <div className='text-red-500 mb-4'>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder='Email'
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder='Password'
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
                    Login
                </button>
            </form>
            <p className='mt-4 text-center'>
                Don't have an account?{' '}
                <button onClick={() => navigate('/register')} className='text-yellow-500'>
                    Register
                </button>
            </p>
        </div>
    );
}