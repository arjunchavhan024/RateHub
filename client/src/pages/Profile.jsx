import React, { useState } from 'react';
import api from '../api/api';

const Profile = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return setError('New passwords do not match');
        }
        try {
            await api.put('/auth/updatepassword', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setMessage('Password updated successfully');
            setError('');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
            setMessage('');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="card">
                <h2>Update Password</h2>
                {message && <p style={{ color: 'var(--success)', marginBottom: '1rem' }}>{message}</p>}
                {error && <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-1">
                        <label className="stat-label">Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwords.currentPassword}
                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-1">
                        <label className="stat-label">New Password (8-16 chars, 1 uppercase, 1 special)</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="stat-label">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
