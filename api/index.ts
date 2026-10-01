import express from 'express';
import { apiRouter } from '../server/routes/api.js';
import { connectDB } from '../server/db.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB or fall back gracefully
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('[Vercel Serverless] Database connection error:', err);
  }
  next();
});

// Mount the API router
app.use('/api', apiRouter);

export default app;
