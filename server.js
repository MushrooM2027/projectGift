const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Gift = require('./models/Gift');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

app.post('/api/gifts', async (req, res) => {
    try {
        const { recipientName, occasion, budget, address } = req.body;
        const suggestions = ['Perfume', 'Watch', 'Book', 'Gift Card', 'Custom Mug'];
        const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];

        const newGift = new Gift({ recipientName, occasion, budget, address, suggestion });
        await newGift.save();
        res.status(200).json(newGift);
    } catch (err) {
        res.status(500).json({ error: 'Failed to suggest gift.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
