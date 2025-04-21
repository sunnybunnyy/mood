import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav>
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-yellow-600">
                    Mood Tracker
                </Link>

                {user ? (
                    <div className="flex items-center space-x-4">
                        <Link to="/entry" className="text-gray-700 hover:text-yellow-600">
                            New Entry
                        </Link>
                        <Link to="/analytics" className="text-gray-700 hover:text-yellow-600">
                            Analytics
                        </Link>
                        <button
                            onClick={logout}
                            className="text-gray-700 hover:text-yellow-600"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="text-gray-700 hover:text-yellow-600">
                            Login
                        </Link>
                        <Link to="/register" className="text-gray-700 hover:text-yellow-600">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}