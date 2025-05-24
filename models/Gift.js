const mongoose = require('mongoose');

const GiftSchema = new mongoose.Schema({
    recipientName: String,
    occasion: String,
    budget: Number,
    address: String,
    suggestion: String
});

module.exports = mongoose.model('Gift', GiftSchema);
