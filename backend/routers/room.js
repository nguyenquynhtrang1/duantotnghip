import express from 'express';
import { body } from 'express-validator';
import { createRoom, deleteRoom, getRoom, getRooms, getTotal, updateRoom } from '../controllers/room.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';
const router = express.Router();

const validateRoom = [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').isNumeric().notEmpty().withMessage('Price is required'),
    body('roomType').notEmpty().withMessage('roomType is required'),
    body('photos').isArray().notEmpty().withMessage('Photos is required'),
]


router.get('/total', verifyToken, verifyAdmin, getTotal);
router.get('/:id', getRoom);
router.get('/', getRooms);
router.post('/', verifyToken, verifyAdmin, validateRoom, createRoom);
router.patch('/:id', verifyToken, verifyAdmin, updateRoom);
router.delete('/:id', verifyToken, verifyAdmin, deleteRoom);

export default router;