import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from '../controller/orderController.js';
import { verifyToken, requireBuyer, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All order routes require authenticated user
router.use(verifyToken);

router.post('/', requireBuyer, createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', requireAdmin, deleteOrder);

export default router;
