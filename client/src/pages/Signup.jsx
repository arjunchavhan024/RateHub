import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            await signup({
                name: formData.name,
                email: formData.email,
                address: formData.address,
                password: formData.password
            });
            navigate('/user');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '5vh' }}>
            <div className="card">
                <h2 className="text-center mb-2">Create Account</h2>
                {error && <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-1">
                        <label className="stat-label">Name (Min 20 characters)</label>
                        <input name="name" value={formData.name} onChange={handleChange} required minLength={20} maxLength={60} />
                    </div>
                    <div className="mb-1">
                        <label className="stat-label">Email</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="mb-1">
                        <label className="stat-label">Address</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} required style={{ height: '80px' }} maxLength={400} />
                    </div>
                    <div className="mb-1">
                        <label className="stat-label">Password (8-16 chars, 1 uppercase, 1 special)</label>
                        <input name="password" type="password" value={formData.password} onChange={handleChange} required minLength={8} maxLength={16} />
                    </div>
                    <div className="mb-2">
                        <label className="stat-label">Confirm Password</label>
                        <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Sign Up
                    </button>
                </form>
                <p className="text-center mt-1" style={{ fontSize: '0.875rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
