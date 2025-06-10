const mongoose = require('mongoose');

const GiftSchema = new mongoose.Schema({
    recipientName: String,
    occasion: String,
    budget: Number,
    address: String,
    suggestion: String,
    suggestionImage: String // <-- Add this line!
});

module.exports = mongoose.model('Gift', GiftSchema);
