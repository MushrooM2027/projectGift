const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Gift = require('./models/Gift');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

// ----- USER REGISTER ROUTE -----
app.post('/api/users/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });
        // Check for duplicate
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: 'User already exists.' });

        // Hash password
        const hash = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hash });
        await newUser.save();

        res.status(201).json({ user: { email: newUser.email } });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed.' });
    }
});

// ----- USER LOGIN ROUTE -----
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid email or password.' });

        // For demo, we just return email (never password!)
        res.status(200).json({ user: { email: user.email } });
    } catch (err) {
        res.status(500).json({ error: 'Login failed.' });
    }
});

// ----- SUGGESTION/GIFT ROUTE -----
app.post('/api/gifts', async (req, res) => {
    try {
        const { recipientName, occasion, budget, address } = req.body;
        const suggestions = [
            { name: 'Perfume', image: 'https://unsplash.com/s/photos/chanel-perfume' },
            { name: 'Watch', image: 'https://www.amazon.in/Smart-Watch-Men-Bluetooth-Smartwatch/dp/B0BMFXNK66' },
            { name: 'Book', image: 'https://about.proquest.com/en/products-services/Books-in-Print/' },
            { name: 'Gift Card', image: 'https://www.ngpf.org/blog/question-of-the-day/question-of-the-day-what-is-the-average-value-of-unused-gift-cards-per-person-in-america/' },
            { name: 'Custom Mug', image: 'https://www.amazon.in/FA6-Personalized-Your-Image-Text/dp/B0CRPZRSP3' }
        ];
        const random = suggestions[Math.floor(Math.random() * suggestions.length)];
        const suggestion = random.name;
        const suggestionImage = random.image

        const newGift = new Gift({ recipientName, occasion, budget, address, suggestion, suggestionImage });
        await newGift.save();
        res.status(200).json({suggestion, image: suggestionImage});
    } catch (err) {
        res.status(500).json({ error: 'Failed to suggest gift.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
