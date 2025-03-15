


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'; // Import dotenv

import authRoutes from './route/authRoutes.js';
import userRoutes from './route/userRoutes.js';
import uploadRoutes from './route/uploadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5300; 
const MONGO_URI = process.env.MONGO_URI; 

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Database connection error:', error));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
