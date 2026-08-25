import express from 'express';
import {
  createReview,
  getFarmerReviews,
  getAllReviews,
  deleteReview,
} from '../controller/reviewController.js';
import { verifyToken, requireBuyer, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public farmer reviews
router.get('/farmers/:id/reviews', getFarmerReviews);

// Buyer submit review
router.post('/', verifyToken, requireBuyer, createReview);

// Admin review management
router.get('/', verifyToken, requireAdmin, getAllReviews);
router.delete('/:id', verifyToken, deleteReview);

export default router;
