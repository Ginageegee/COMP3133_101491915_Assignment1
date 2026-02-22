const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email:    { type: String, unique: true, required: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Mongoose v7+ — no next() needed
userSchema.pre('save', function () {
    this.updated_at = new Date();
});

module.exports = mongoose.model('User', userSchema);
