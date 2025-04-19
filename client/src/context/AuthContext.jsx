import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [habits, setHabits] = useState([]);
    const navigate = useNavigate();

    // Set auth token
    const setAuthToken = (token) => {
        if (token) {
            axios.defaults.headers.common['x-auth-token'] = token;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['x-auth-token'];
            localStorage.removeItem('token');
        }
    };

    // Load user
    const loadUser = async () => {
        try {
            const res = await axios.get('/api/auth');
            setUser(res.data);
            setHabits(res.data.habits || []);
        } catch (err) {
            logout();
        }
    };

    // Register
    const register = async (formData) => {
        try {
            const res = await axios.post('/api/auth/register', formData);
            setToken(res.data.token);
            setAuthToken(res.data.token);
            await loadUser();
            navigate('/dashboard');
        } catch (err) {
            throw err.response.data.error;
        }
    };

    // Login
    const login = async (formData) => {
        try {
            const res = await axios.post('/api/auth/login', formData);
            setToken(res.data.token);
            setAuthToken(res.data.token);
            setHabits(res.data.habits || []);
            await loadUser();
            navigate('/dashboard');
        } catch (err) {
            throw err.response.data.error;
        }
    };

    // Logout
    const logout = () => {
        setToken(null);
        setAuthToken(null);
        setUser(null);
        navigate('/login');
    };

    // Initialize auth
    useEffect(() => {
        if (token) {
            setAuthToken(token);
            loadUser();
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, token, habits, register, login, logout, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}