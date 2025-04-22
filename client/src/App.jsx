import './App.css'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import MoodEntry from './pages/MoodEntry';
import Analytics from './pages/Analytics';
import Navbar from './components/Navbar';

function LayoutWithNavbar() {
  return (
    <>
    <Navbar />
    <div className='container mx-auto p-4'>
      <Outlet />
    </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
          <Routes>
            {/* Routes with Navbar */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          
            {/* Routes with Navbar */}
            <Route element={<LayoutWithNavbar />}>
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/entry" element={<PrivateRoute><MoodEntry /></PrivateRoute>} />
              <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
            </Route>
          </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
