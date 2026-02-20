const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Store name is required'],
        minlength: [2, 'Store name must be at least 2 characters'],
        maxlength: [100, 'Store name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Store email is required'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    address: {
        type: String,
        required: [true, 'Store address is required'],
        maxlength: [400, 'Store address cannot exceed 400 characters']
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Store', storeSchema);
