import express from 'express';
import { body } from 'express-validator';
import { changePassword, createUser, deleteUser, getProfile, getTotal, getUser, getUsers, updateUser } from '../controllers/user.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

const validateUser = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().notEmpty().withMessage('Email is required'),
    body('phone').isMobilePhone(),
    body('password').notEmpty().withMessage('Email is required'),
    body('isAdmin').isBoolean().withMessage('isAdmin is required'),
]

router.get('/profile', verifyToken, getProfile);
router.get('/total', verifyToken, verifyAdmin, getTotal);
router.get('/:id', verifyToken, getUser);
router.get('/', verifyToken, verifyAdmin, getUsers);
router.post('/', verifyToken, verifyAdmin, validateUser, createUser);
router.patch('/change-password', verifyToken, changePassword);
router.patch('/:id', verifyToken, verifyAdmin, updateUser);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

export default router;