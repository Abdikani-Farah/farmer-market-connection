import express from 'express';
import { getBuyerOrders, getBuyerStats } from '../controller/buyerController.js';
import { requireBuyer, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken, requireBuyer);
router.get('/stats', getBuyerStats);
router.get('/orders', getBuyerOrders);

export default router;
