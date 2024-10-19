import express from 'express';
import { body } from 'express-validator';
import { getBookings, getBooking, deleteBooking, getUserBookings, clientCreateBooking, adminCreateBooking, clientUpdateBooking, adminUpdateBooking, getRevenueByMonth, getRevenueByRoomType, getTotal, createUrlPayment, paymentWebhook } from '../controllers/booking.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';

const router = express.Router();

const validateClientBooking = [
    body('roomId').notEmpty().isMongoId().withMessage('roomId is required'),
    body('checkIn').isDate().notEmpty().withMessage('CheckIn is required'),
    body('checkOut').isDate().notEmpty().withMessage('CheckOut is required'),
]

const validateAdminBooking = [
    body('userId').notEmpty().isMongoId().withMessage('userId is required'),
    ...validateClientBooking
]

const validateClientUpdateBooking = [
    body('status').notEmpty().withMessage('Status is required'),
    body('bookingId').notEmpty().isMongoId().withMessage('bookingId is required')
]
const validateAdminUpdateBooking = [
    ...validateClientUpdateBooking,
    body('userId').notEmpty().isMongoId().withMessage('userId is required')
]

router.get('/', verifyToken, verifyAdmin, getBookings);
router.get('/client', verifyToken, getUserBookings);
router.get('/revenueByMonth', verifyToken, verifyAdmin, getRevenueByMonth);
router.get('/revenueByRoomType', verifyToken, verifyAdmin, getRevenueByRoomType);
router.get('/total', verifyToken, verifyAdmin, getTotal);
router.get('/:id', verifyToken, verifyAdmin, getBooking);
router.post('/client', verifyToken, validateClientBooking, clientCreateBooking);
router.post('/admin', verifyToken, verifyAdmin, validateAdminBooking, adminCreateBooking);
router.post("/payments", verifyToken, createUrlPayment);
router.post("/momo-webhook", paymentWebhook);
router.patch('/client/:id', verifyToken, validateClientUpdateBooking, clientUpdateBooking);
router.patch('/admin/:id', verifyToken, verifyAdmin, validateAdminUpdateBooking, adminUpdateBooking)
router.delete('/:id', verifyToken, verifyAdmin, deleteBooking);

export default router;