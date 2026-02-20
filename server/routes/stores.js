const express = require('express');
const router = express.Router();
const {
    getStores,
    addStore,
    submitRating,
    getStoreStats,
    getAdminStats
} = require('../controllers/storeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Publicly accessible for any logged in user
router.get('/', getStores);

// User only routes
router.post('/:id/rate', authorize('Normal User'), submitRating);

// Store owner only routes
router.get('/mystats', authorize('Store Owner'), getStoreStats);

// Admin only routes
router.post('/', authorize('System Administrator'), addStore);
router.get('/admin/stats', authorize('System Administrator'), getAdminStats);

module.exports = router;
