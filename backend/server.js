const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const Admin = require('./models/Admin'); // Add this

// Middleware
app.use(cors({
    origin: 'http://16.171.253.122', // your frontend URL
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/grocery-store', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    console.log('MongoDB Connected');

    // ✅ Auto-create default admin
    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
    if (!existingAdmin) {
        const admin = new Admin({
            name: 'Super Admin',
            email: 'admin@example.com',
            password: 'admin123'
        });
        await admin.save();
        console.log('Default admin created successfully');
    } else {
        console.log('Admin already exists');
    }
})
.catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/products'));
app.use('/api', require('./routes/cart'));
app.use('/api', require('./routes/orders'));
app.use('/api', require('./routes/user'));
app.use('/api/admin', require('./routes/admin'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
