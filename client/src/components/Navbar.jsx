import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard' || location.pathname === '/';

    return (
        <nav className="">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className='flex items-center'>
                    <img src="lemon.gif" alt="Logo" className="h-12 mr-2" />
                    <span className="text-2xl text-yellow-600">Mood</span>
                </div>
                <h1 className="text-3xl font-bold absolute left-1/2 transform -translate-x-1/2">
                    {isDashboard ? 'Your Entries' : 'Analytics'}
                </h1>
                
                <div className='flex items-center space-x-4'>
                    {isDashboard ? (
                        <>
                            <Link
                                to="/entry"
                                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                                Add New Entry
                            </Link>
                            <Link
                                to="/analytics"
                                className="text-yellow-500 hover:underline"
                            >
                                View Analytics →
                            </Link>
                        </>
                    ) : (
                        <Link
                            to="/dashboard"
                            className='text-yellow-500 hover:underline'
                        >
                            Dashboard
                        </Link>
                    )}
                    <button
                        onClick={logout}
                        className="text-gray-700 hover:text-yellow-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};