import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import loadRoutes from './routes/loadRoutes.js';

dotenv.config();

const app = express();

app.use(cors());

// Express body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// DB Connect
const db = process.env.MONGO_URI;

mongoose
   .connect(db)
   .then(() => console.log('Mongo DB Connected...'))
   .catch(() => console.log('An error occured...'));

// API Routes
app.get('/', (req, res) => {
   res.send('APP IS RUNNING');
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/loads', loadRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server up and running on ${PORT}`));
