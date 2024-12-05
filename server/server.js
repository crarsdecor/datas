import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; 
import authRoutes from './route/authRoutes.js';
import userRoutes from './route/userRoutes.js';

const app = express();
const PORT = 5300;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://saumic:saumic123@cluster0.pxceo4x.mongodb.net/crm?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Database connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});