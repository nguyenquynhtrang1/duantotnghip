import express from 'express';
import { body } from 'express-validator';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';
import { createOrUpdateReview, deleteReviewById, getAllReviews, getReviewByRoomId } from '../controllers/review.js';

const router = express.Router();

const validateReview = [
    body('roomId').notEmpty().isMongoId().withMessage('room is required'),
    body('rating').isNumeric().notEmpty().withMessage('Rating is required'),
    body('comment').notEmpty().withMessage('Comment is required'),
]

router.get('/', verifyToken, verifyAdmin, getAllReviews);
router.get('/client', getReviewByRoomId);
router.post('/', verifyToken, validateReview, createOrUpdateReview);
router.delete('/:id', verifyToken, verifyAdmin, deleteReviewById);

export default router;