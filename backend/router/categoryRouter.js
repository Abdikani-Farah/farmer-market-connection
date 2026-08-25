import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controller/categoryController.js';
import { verifyToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getCategories);

// Admin only
router.post('/', verifyToken, requireAdmin, createCategory);
router.put('/:id', verifyToken, requireAdmin, updateCategory);
router.delete('/:id', verifyToken, requireAdmin, deleteCategory);

export default router;
