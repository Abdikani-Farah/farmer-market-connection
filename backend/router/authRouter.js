import express from 'express';
import {
  getMe,
  getProfile,
  getUserById,
  login,
  logout,
  register,
  updateProfile,
} from '../controller/authController.js';
import { deleteUser, getAllUsers, toggleBlockUser } from '../controller/adminController.js';
import { requireAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.post('/logout', logout);

// Kept here so the existing /api/users endpoints remain available without
// adding an extra user controller/router outside the requested structure.
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.get('/', verifyToken, requireAdmin, getAllUsers);
router.put('/:id/block', verifyToken, requireAdmin, toggleBlockUser);
router.delete('/:id', verifyToken, requireAdmin, deleteUser);
router.get('/:id', getUserById);

export default router;
