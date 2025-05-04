import express, { NextFunction, Request, Response } from 'express';
import authRoutes from './routes/auth.routes';
import dotenv from 'dotenv';
import { connectDB } from './config/db.config';
import { errorHandler } from '@one-cart/common/';
import { logger } from '@one-cart/common';

dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

//handle error
app.use(errorHandler);



connectDB()
  .then(() => {
    logger.info('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Auth service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });
