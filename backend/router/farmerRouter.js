import express from 'express';
import {
  getFarmerFarm,
  getFarmerOrders,
  getFarmerProducts,
  getFarmerStats,
  updateFarmerFarm,
} from '../controller/farmerController.js';
import { requireFarmer, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken, requireFarmer);
router.get('/stats', getFarmerStats);
router.get('/orders', getFarmerOrders);
router.get('/products', getFarmerProducts);
router.get('/farm', getFarmerFarm);
router.put('/farm', updateFarmerFarm);

export default router;
