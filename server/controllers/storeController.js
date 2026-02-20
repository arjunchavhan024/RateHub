const Store = require('../models/Store');
const Rating = require('../models/Rating');
const User = require('../models/User');

// @desc    Get all stores
// @route   GET /api/stores
// @access  Private (Logged in users)
exports.getStores = async (req, res) => {
    try {
        const { name, address, sort } = req.query;
        let query = {};

        if (name) query.name = { $regex: name, $options: 'i' };
        if (address) query.address = { $regex: address, $options: 'i' };

        let storesQuery = Store.find(query);

        if (sort) {
            const sortBy = sort.split(',').join(' ');
            storesQuery = storesQuery.sort(sortBy);
        } else {
            storesQuery = storesQuery.sort('name');
        }

        const stores = await storesQuery;

        // Fetch ratings for each store
        const storesWithRatings = await Promise.all(stores.map(async (store) => {
            const ratings = await Rating.find({ store: store._id });
            const averageRating = ratings.length > 0
                ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
                : 0;

            const userRating = await Rating.findOne({ store: store._id, user: req.user._id });

            return {
                ...store._doc,
                averageRating,
                userRating: userRating ? userRating.rating : null
            };
        }));

        res.status(200).json({ success: true, count: stores.length, data: storesWithRatings });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Add new store
// @route   POST /api/stores
// @access  Private/Admin
exports.addStore = async (req, res) => {
    try {
        const { name, email, address, ownerEmail } = req.body;

        // Find owner by email
        const owner = await User.findOne({ email: ownerEmail, role: 'Store Owner' });
        if (!owner) {
            return res.status(404).json({ message: 'Store owner not found' });
        }

        const store = await Store.create({
            name,
            email,
            address,
            owner: owner._id
        });

        res.status(201).json({ success: true, data: store });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Submit or modify rating
// @route   POST /api/stores/:id/rate
// @access  Private/User
exports.submitRating = async (req, res) => {
    try {
        const { rating } = req.body;
        const storeId = req.params.id;

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        let ratingObj = await Rating.findOne({ store: storeId, user: req.user._id });

        if (ratingObj) {
            // Update existing rating
            ratingObj.rating = rating;
            await ratingObj.save();
        } else {
            // Create new rating
            ratingObj = await Rating.create({
                store: storeId,
                user: req.user._id,
                rating
            });
        }

        res.status(200).json({ success: true, data: ratingObj });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get store owner dashboard stats
// @route   GET /api/stores/mystats
// @access  Private/StoreOwner
exports.getStoreStats = async (req, res) => {
    try {
        const store = await Store.findOne({ owner: req.user._id });
        if (!store) {
            return res.status(404).json({ message: 'Store not found for this owner' });
        }

        const ratings = await Rating.find({ store: store._id }).populate('user', 'name email address');
        const averageRating = ratings.length > 0
            ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
            : 0;

        res.status(200).json({
            success: true,
            data: {
                storeName: store.name,
                averageRating,
                ratings: ratings // List of users who submitted ratings
            }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStores = await Store.countDocuments();
        const totalRatings = await Rating.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalStores,
                totalRatings
            }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
