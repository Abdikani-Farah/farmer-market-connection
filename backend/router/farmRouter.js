import express from 'express';
import {
  getFarms,
  getFarmById,
  getMyFarm,
  createFarm,
  updateFarm,
  deleteFarm,
  toggleFarmVerification,
} from '../controller/farmController.js';
import { verifyToken, requireFarmer, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getFarms);

// Farmer authenticated
router.get('/me', verifyToken, requireFarmer, getMyFarm);
router.post('/', verifyToken, requireFarmer, createFarm);

// Specific Farm
router.get('/:id', getFarmById);
router.put('/:id', verifyToken, updateFarm);
router.delete('/:id', verifyToken, deleteFarm);

// Admin verification toggle
router.put('/:id/verify', verifyToken, requireAdmin, toggleFarmVerification);

export default router;
