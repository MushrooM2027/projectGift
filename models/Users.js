const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
    // Add additional fields here if needed, e.g. name, createdAt, etc.
});

module.exports = mongoose.model('User', UserSchema);
