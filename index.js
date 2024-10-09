const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  // Add CORS

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4200',  // Allow requests from your frontend (Angular)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed HTTP methods
    credentials: true  // Enable cookies and other credentials if necessary
}));

// Import routes
const authRoutes = require('./Auth/api/auth.routes');

// Use routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
