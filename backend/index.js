import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import authRouter from './router/authRouter.js';
import adminRouter from './router/adminRouter.js';
import farmerRouter from './router/farmerRouter.js';
import buyerRouter from './router/buyerRouter.js';
import farmRouter from './router/farmRouter.js';
import productRouter from './router/productRouter.js';
import categoryRouter from './router/categoryRouter.js';
import orderRouter from './router/orderRouter.js';
import reviewRouter from './router/reviewRouter.js';
import { getPlatformStats } from './controller/adminController.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Farmer Market Connection API',
  });
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Database Connected Successful');
  })
  .catch((error) => {
    console.log(error);
  });

// /api paths preserve the current frontend contract. Direct paths keep the
// backend convenient to use independently, as in a conventional MERN app.
app.get('/api/stats', getPlatformStats);
app.get('/stats', getPlatformStats);
app.use('/api/auth', authRouter);
app.use('/auth', authRouter);
app.use('/api/users', authRouter);
app.use('/api/admin', adminRouter);
app.use('/admin', adminRouter);
app.use('/api/farmer', farmerRouter);
app.use('/farmer', farmerRouter);
app.use('/api/buyer', buyerRouter);
app.use('/buyer', buyerRouter);
app.use('/api/farms', farmRouter);
app.use('/farms', farmRouter);
app.use('/api/products', productRouter);
app.use('/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/categories', categoryRouter);
app.use('/api/orders', orderRouter);
app.use('/orders', orderRouter);
app.use('/api/reviews', reviewRouter);
app.use('/reviews', reviewRouter);

app.use(errorHandler);

const port = process.env.PORT || 9003;

app.listen(port, () => {
  console.log(`The Server is Running on Port ${port}`);
});
