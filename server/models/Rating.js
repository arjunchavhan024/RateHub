const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    store: {
        type: mongoose.Schema.ObjectId,
        ref: 'Store',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating value is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5']
    }
}, {
    timestamps: true
});

// Ensure a user can only rate a store once
ratingSchema.index({ user: 1, store: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
