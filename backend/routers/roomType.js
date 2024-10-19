import express from 'express';
import { body } from 'express-validator';
import {
    createRoomType,
    getAllRoomTypes,
    getRoomTypeById,
    updateRoomTypeById,
    deleteRoomTypeById
} from '../controllers/roomType.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

const validateRoomType = [
    body('name').notEmpty().withMessage('Name is required')
]

router.get('/:id', verifyToken, verifyAdmin, getRoomTypeById);
router.get('/', getAllRoomTypes);
router.post('/', verifyToken, verifyAdmin, validateRoomType, createRoomType);
router.patch('/:id', verifyToken, verifyAdmin, validateRoomType, updateRoomTypeById);
router.delete('/:id', verifyToken, verifyAdmin, deleteRoomTypeById);

export default router;