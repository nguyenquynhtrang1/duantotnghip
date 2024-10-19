import express from 'express';
import { body } from 'express-validator';
import { login, register, refreshToken } from '../controllers/auth.js';

const router = express.Router();

const validateLogin = [
    body('email').isEmail().notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required'),
]

const validateRegister = [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().notEmpty().withMessage('Email is required'),
    body('phone').isMobilePhone(),
    body('password').notEmpty().withMessage('Password is required'),
]


router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
router.post('/refresh-token', refreshToken);
router.post('/logout', (_, res) => {
    res.status(200).json({ message: 'Logout success' });
});

export default router;