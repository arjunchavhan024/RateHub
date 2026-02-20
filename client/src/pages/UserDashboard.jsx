import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Search, Star, MapPin } from 'lucide-react';

const UserDashboard = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ name: '', address: '', sort: 'name' });

    useEffect(() => {
        fetchStores();
    }, [filters]);

    const fetchStores = async () => {
        try {
            const res = await api.get('/stores', { params: filters });
            setStores(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRate = async (storeId, rating) => {
        try {
            await api.post(`/stores/${storeId}/rate`, { rating });
            fetchStores();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit rating');
        }
    };

    const handleSort = (field) => {
        const newSort = filters.sort === field ? `-${field}` : field;
        setFilters({ ...filters, sort: newSort });
    };

    if (loading) return <div>Loading stores...</div>;

    return (
        <div>
            <h1 className="mb-2">Registered Stores</h1>

            <div className="flex gap-1 mb-2">
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} size={18} />
                    <input
                        placeholder="Search by Name"
                        value={filters.name}
                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                        style={{ paddingLeft: '2.5rem', marginBottom: 0 }}
                    />
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                    <MapPin style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} size={18} />
                    <input
                        placeholder="Search by Address"
                        value={filters.address}
                        onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                        style={{ paddingLeft: '2.5rem', marginBottom: 0 }}
                    />
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('name')}>Store Name</th>
                            <th onClick={() => handleSort('address')}>Address</th>
                            <th>Overall Rating</th>
                            <th>Your Rating</th>
                            <th>Submit/Modify Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map(store => (
                            <tr key={store._id}>
                                <td style={{ fontWeight: '600' }}>{store.name}</td>
                                <td>{store.address}</td>
                                <td>
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < Math.round(store.averageRating || 0) ? '#fbbf24' : 'none'} />
                                        ))}
                                        <span style={{ fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                                            ({store.averageRating?.toFixed(1) || '0.0'})
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    {store.userRating ? (
                                        <div className="flex">
                                            <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                            <span>{store.userRating}</span>
                                        </div>
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Not rated</span>
                                    )}
                                </td>
                                <td>
                                    <div className="flex" style={{ gap: '0.2rem' }}>
                                        {[1, 2, 3, 4, 5].map(num => (
                                            <button
                                                key={num}
                                                onClick={() => handleRate(store._id, num)}
                                                className="btn"
                                                style={{
                                                    padding: '0.3rem',
                                                    background: store.userRating === num ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                                    border: 'none',
                                                    borderRadius: '4px'
                                                }}
                                                title={`Rate ${num} stars`}
                                            >
                                                <Star size={14} fill={store.userRating >= num ? '#fff' : 'none'} />
                                            </button>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserDashboard;
