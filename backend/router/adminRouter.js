import express from 'express';
import {
  getAdminFarms,
  getAdminOrders,
  getAdminStats,
  createUser,
  getAllUsers,
  updateUserStatus,
  verifyFarm,
} from '../controller/adminController.js';
import { requireAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken, requireAdmin);
router.get('/stats', getAdminStats);
router.get('/farms', getAdminFarms);
router.put('/farms/:id/verify', verifyFarm);
router.get('/orders', getAdminOrders);
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/block', updateUserStatus);

export default router;
