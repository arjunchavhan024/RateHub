import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Star, Users, TrendingUp } from 'lucide-react';

const OwnerDashboard = () => {
    const [data, setData] = useState({ storeName: '', averageRating: 0, ratings: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/stores/mystats');
            setData(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading your store stats...</div>;

    return (
        <div>
            <h1 className="mb-2">Store Owner Dashboard: {data.storeName}</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="flex justify-between">
                        <TrendingUp size={32} color="var(--primary)" />
                        <div className="stat-value">{data.averageRating.toFixed(1)}</div>
                    </div>
                    <div className="stat-label">Average Store Rating</div>
                    <div className="stars mt-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill={i < Math.round(data.averageRating) ? '#fbbf24' : 'none'} />
                        ))}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="flex justify-between">
                        <Users size={32} color="var(--accent)" />
                        <div className="stat-value">{data.ratings.length}</div>
                    </div>
                    <div className="stat-label">Total Ratings Received</div>
                </div>
            </div>

            <h2 className="mb-2">User Ratings</h2>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>User Email</th>
                            <th>User Address</th>
                            <th>Rating Given</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.ratings.length > 0 ? (
                            data.ratings.map(rating => (
                                <tr key={rating._id}>
                                    <td>{rating.user.name}</td>
                                    <td>{rating.user.email}</td>
                                    <td>{rating.user.address}</td>
                                    <td>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < rating.rating ? '#fbbf24' : 'none'} />
                                            ))}
                                            <span style={{ marginLeft: '0.5rem' }}>{rating.rating}</span>
                                        </div>
                                    </td>
                                    <td>{new Date(rating.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center" style={{ color: 'var(--text-muted)' }}>
                                    No ratings received yet for your store.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OwnerDashboard;
