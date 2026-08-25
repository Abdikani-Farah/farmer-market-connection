import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
} from '../controller/productController.js';
import { verifyToken, requireFarmer, requireAdmin } from '../middleware/authMiddleware.js';
import upload from '../images/multer.js';

const router = express.Router();

// Public browse & search
router.get('/', getProducts);
router.get('/:id', getProductById);

// Farmer product management
router.post('/', verifyToken, requireFarmer, upload.single('image'), createProduct);
router.put('/:id', verifyToken, upload.single('image'), updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

// Admin approval & status toggle
router.put('/:id/status', verifyToken, requireAdmin, updateProductStatus);

export default router;
