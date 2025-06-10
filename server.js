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
            { name: 'Perfume', image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=500&q=80' },
            { name: 'Watch', image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=500&q=80' },
            { name: 'Book', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80' },
            { name: 'Gift Card', image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=500&q=80' },
            { name: 'Custom Mug', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80' }
        ];
        const random = suggestions[Math.floor(Math.random() * suggestions.length)];
        const suggestion = random.name;
        const suggestionImage = random.image

        const newGift = new Gift({ recipientName, occasion, budget, address, suggestion, suggestionImage });
        await newGift.save();
        res.status(200).json({ suggestion, image: suggestionImage });
    } catch (err) {
        res.status(500).json({ error: 'Failed to suggest gift.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
