import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Store, LayoutDashboard } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return <Outlet />;

    return (
        <div>
            <nav>
                <Link to="/" className="logo">RateHub</Link>
                <div className="nav-links">
                    {user.role === 'System Administrator' && (
                        <Link to="/admin" className="nav-link">Admin Dash</Link>
                    )}
                    {user.role === 'Store Owner' && (
                        <Link to="/owner" className="nav-link">Owner Dash</Link>
                    )}
                    {user.role === 'Normal User' && (
                        <Link to="/user" className="nav-link">Stores</Link>
                    )}
                    <Link to="/profile" className="nav-link">Profile</Link>
                </div>
                <div className="flex">
                    <span style={{ marginRight: '1rem', color: 'var(--text-muted)' }}>
                        {user.name} ({user.role})
                    </span>
                    <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </nav>
            <main className="container">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
