const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const { name, email, address, role, sort } = req.query;
        let query = {};

        if (name) query.name = { $regex: name, $options: 'i' };
        if (email) query.email = { $regex: email, $options: 'i' };
        if (address) query.address = { $regex: address, $options: 'i' };
        if (role) query.role = role;

        let usersQuery = User.find(query);

        if (sort) {
            const sortBy = sort.split(',').join(' ');
            usersQuery = usersQuery.sort(sortBy);
        } else {
            usersQuery = usersQuery.sort('name');
        }

        const users = await usersQuery;

        // If user is Store Owner, fetch their store rating
        const usersWithStats = await Promise.all(users.map(async (user) => {
            if (user.role === 'Store Owner') {
                const store = await Store.findOne({ owner: user._id });
                if (store) {
                    const ratings = await Rating.find({ store: store._id });
                    const averageRating = ratings.length > 0
                        ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
                        : 0;
                    return { ...user._doc, rating: averageRating, storeName: store.name };
                }
            }
            return user;
        }));

        res.status(200).json({ success: true, count: users.length, data: usersWithStats });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Add new user
// @route   POST /api/users
// @access  Private/Admin
exports.addUser = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        // Validate password rules
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must be 8-16 characters and include at least one uppercase letter and one special character'
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            address,
            role
        });

        res.status(201).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let userData = { ...user._doc };

        if (user.role === 'Store Owner') {
            const store = await Store.findOne({ owner: user._id });
            if (store) {
                const ratings = await Rating.find({ store: store._id });
                const averageRating = ratings.length > 0
                    ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
                    : 0;
                userData.rating = averageRating;
                userData.storeName = store.name;
            }
        }

        res.status(200).json({ success: true, data: userData });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
