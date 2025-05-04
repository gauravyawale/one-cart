import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.config';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

//handle error
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

connectDB()
  .then(() => {
    console.log('Database connected successfully');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });
