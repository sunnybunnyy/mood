import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const naviagte = useNavigate();

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
            <h1 className="text-2x1 font-bold mb-4">Login</h1>
            {error && <div className='text-red-500 mb-4'>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label htmlFor="" className='block mb-2'>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2"> Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Login
                </button>
            </form>
            <p className='mt-4 text-center'>
                Don't have an account?{' '}
                <button onClick={() => navigate('/register')} className='text-blue-500'>
                    Register
                </button>
            </p>
        </div>
    );
}