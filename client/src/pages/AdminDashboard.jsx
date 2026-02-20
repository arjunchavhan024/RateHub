import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Users, Store, Star, Plus, Search, Filter } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUserForm, setShowUserForm] = useState(false);
    const [showStoreForm, setShowStoreForm] = useState(false);

    // Filters & Sorting
    const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '', sort: 'name' });
    const [storeFilters, setStoreFilters] = useState({ name: '', address: '', sort: 'name' });

    // Forms
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'Normal User' });
    const [newStore, setNewStore] = useState({ name: '', email: '', address: '', ownerEmail: '' });

    useEffect(() => {
        fetchData();
    }, [userFilters, storeFilters]);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes, storesRes] = await Promise.all([
                api.get('/stores/admin/stats'),
                api.get('/users', { params: userFilters }),
                api.get('/stores', { params: storeFilters })
            ]);
            setStats(statsRes.data.data);
            setUsers(usersRes.data.data);
            setStores(storesRes.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', newUser);
            setShowUserForm(false);
            setNewUser({ name: '', email: '', password: '', address: '', role: 'Normal User' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add user');
        }
    };

    const handleAddStore = async (e) => {
        e.preventDefault();
        try {
            await api.post('/stores', newStore);
            setShowStoreForm(false);
            setNewStore({ name: '', email: '', address: '', ownerEmail: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add store');
        }
    };

    const handleSort = (type, field) => {
        if (type === 'user') {
            const newSort = userFilters.sort === field ? `-${field}` : field;
            setUserFilters({ ...userFilters, sort: newSort });
        } else {
            const newSort = storeFilters.sort === field ? `-${field}` : field;
            setStoreFilters({ ...storeFilters, sort: newSort });
        }
    };

    if (loading) return <div>Loading Dashboard...</div>;

    return (
        <div>
            <h1 className="mb-2">System Administrator Dashboard</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="flex justify-between">
                        <Users size={32} color="var(--primary)" />
                        <div className="stat-value">{stats.totalUsers}</div>
                    </div>
                    <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card">
                    <div className="flex justify-between">
                        <Store size={32} color="var(--accent)" />
                        <div className="stat-value">{stats.totalStores}</div>
                    </div>
                    <div className="stat-label">Total Stores</div>
                </div>
                <div className="stat-card">
                    <div className="flex justify-between">
                        <Star size={32} color="#fbbf24" />
                        <div className="stat-value">{stats.totalRatings}</div>
                    </div>
                    <div className="stat-label">Total Ratings</div>
                </div>
            </div>

            <div className="flex justify-between mb-2">
                <h2>User Management</h2>
                <button className="btn btn-primary" onClick={() => setShowUserForm(!showUserForm)}>
                    <Plus size={18} /> Add User
                </button>
            </div>

            {showUserForm && (
                <div className="card mb-2">
                    <h3>Add New User</h3>
                    <form onSubmit={handleAddUser} className="mt-1">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
                            <input placeholder="Email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
                            <input placeholder="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
                            <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                                <option value="Normal User">Normal User</option>
                                <option value="Store Owner">Store Owner</option>
                                <option value="System Administrator">System Administrator</option>
                            </select>
                            <input placeholder="Address" value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} required style={{ gridColumn: 'span 2' }} />
                        </div>
                        <button type="submit" className="btn btn-primary">Save User</button>
                    </form>
                </div>
            )}

            <div className="flex gap-1 mb-1">
                <input placeholder="Filter by Name" value={userFilters.name} onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })} style={{ marginBottom: 0 }} />
                <input placeholder="Filter by Email" value={userFilters.email} onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })} style={{ marginBottom: 0 }} />
                <select value={userFilters.role} onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })} style={{ marginBottom: 0 }}>
                    <option value="">All Roles</option>
                    <option value="Normal User">Normal User</option>
                    <option value="Store Owner">Store Owner</option>
                    <option value="System Administrator">System Admin</option>
                </select>
            </div>

            <div className="table-container mb-2">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('user', 'name')}>Name</th>
                            <th onClick={() => handleSort('user', 'email')}>Email</th>
                            <th onClick={() => handleSort('user', 'address')}>Address</th>
                            <th onClick={() => handleSort('user', 'role')}>Role</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.address}</td>
                                <td>{user.role}</td>
                                <td>{user.role === 'Store Owner' ? (user.rating ? user.rating.toFixed(1) : 'N/A') : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between mb-2">
                <h2>Store Management</h2>
                <button className="btn btn-primary" onClick={() => setShowStoreForm(!showStoreForm)}>
                    <Plus size={18} /> Add Store
                </button>
            </div>

            {showStoreForm && (
                <div className="card mb-2">
                    <h3>Add New Store</h3>
                    <form onSubmit={handleAddStore} className="mt-1">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input placeholder="Store Name" value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} required />
                            <input placeholder="Store Email" type="email" value={newStore.email} onChange={(e) => setNewStore({ ...newStore, email: e.target.value })} required />
                            <input placeholder="Owner Email" value={newStore.ownerEmail} onChange={(e) => setNewStore({ ...newStore, ownerEmail: e.target.value })} required />
                            <input placeholder="Address" value={newStore.address} onChange={(e) => setNewStore({ ...newStore, address: e.target.value })} required style={{ gridColumn: 'span 2' }} />
                        </div>
                        <button type="submit" className="btn btn-primary">Save Store</button>
                    </form>
                </div>
            )}

            <div className="flex gap-1 mb-1">
                <input placeholder="Filter by Name" value={storeFilters.name} onChange={(e) => setStoreFilters({ ...storeFilters, name: e.target.value })} style={{ marginBottom: 0 }} />
                <input placeholder="Filter by Address" value={storeFilters.address} onChange={(e) => setStoreFilters({ ...storeFilters, address: e.target.value })} style={{ marginBottom: 0 }} />
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('store', 'name')}>Store Name</th>
                            <th onClick={() => handleSort('store', 'email')}>Email</th>
                            <th onClick={() => handleSort('store', 'address')}>Address</th>
                            <th>Overall Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map(store => (
                            <tr key={store._id}>
                                <td>{store.name}</td>
                                <td>{store.email}</td>
                                <td>{store.address}</td>
                                <td>
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} fill={i < Math.round(store.averageRating || 0) ? '#fbbf24' : 'none'} />
                                        ))}
                                        <span className="mt-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            ({store.averageRating?.toFixed(1) || '0.0'})
                                        </span>
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

export default AdminDashboard;
