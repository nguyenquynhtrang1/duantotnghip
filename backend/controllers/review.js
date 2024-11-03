import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Room from '../models/Room.js';

// Create a new review
export const createOrUpdateReview = async (req, res) => {
    try {
        const { roomId, ...reviewData } = req.body;
        let review = await Review.findOneAndUpdate(
            { 'user._id': req.user._id, 'room._id': roomId },
            { ...reviewData },
            { new: true, upsert: true }
        );
        // update average rating of room
        const reviews = await Review.find({ 'room._id': roomId });
        const totalRating = reviews.reduce((acc, { rating = 0 }) => acc + rating, 0);
        const averageRating = totalRating / (reviews.length || 1);
        await Room.findByIdAndUpdate(roomId, { rating: averageRating });
        return res.status(200).json({ message: 'Review created or updated successfully', data: review });
    } catch (error) {
        return res.status(400).json({ message: 'Error creating or updating review', data: error });
    }
};

// Get all reviews
export const getAllReviews = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            orderBy = "createdAt",
            sortBy = "desc",
            search
        } = req.query;
        const conditions = {};

        if (search) {
            conditions.$or = [
                { 'user.username': { $regex: search, $options: 'i' } },
                { 'user.email': { $regex: search, $options: 'i' } },
                { 'room.name': { $regex: search, $options: 'i' } },
                { '_id': mongoose.Types.ObjectId.isValid(search) ? new mongoose.Types.ObjectId(search) : null }
            ];
        }
        const reviews = await Review.find(conditions)
            .sort({ [orderBy]: sortBy })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const total = await Review.countDocuments(conditions);
        return res.status(200).json({ message: 'Reviews fetched successfully', data: reviews, limit, page, total });
    } catch (error) {
        console.log("🚀 ~ getAllReviews ~ error:", error)
        return res.status(500).json({ message: 'Error fetching reviews', data: error });
    }
};

// Get a review by roomId
export const getReviewByRoomId = async (req, res) => {
    try {
        const { page = 1, limit = 10, roomId } = req.query;
        const reviews = await Review.find({ 'room._id': roomId })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const total = await Review.countDocuments({ 'room._id': roomId });
        return res.status(200).json({ message: 'Reviews fetched successfully', data: reviews, total, limit, page });
    } catch (error) {
        console.log("🚀 ~ getReviewByRoomId ~ error:", error)
        return res.status(500).json({ message: 'Error fetching reviews', data: error });
    }
};

// Delete a review by ID
export const deleteReviewById = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        // update average rating of room
        const reviews = await Review.find({ 'room._id': review.room._id });
        const totalRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) : 0
        const averageRating = totalRating / (reviews.length || 1);
        await Room.findByIdAndUpdate(review.room._id, { rating: averageRating });
        return res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.log("🚀 ~ deleteReviewById ~ error:", error)
        return res.status(500).json({ message: 'Error deleting review', data: error });
    }
};