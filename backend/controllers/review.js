import Review from '../models/Review.js';
import Room from '../models/Room.js';

// Create a new review
export const createOrUpdateReview = async (req, res) => {
    try {
        const { roomId, ...reviewData } = req.body;
        let review = await Review.findOneAndUpdate(
            { user: req.user._id, room: roomId },
            { ...reviewData },
            { new: true, upsert: true }
        );
        // update average rating of room
        const reviews = await Review.find({ room: roomId });
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

        const aggregatePipeline = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $lookup: {
                    from: 'rooms',
                    localField: 'room',
                    foreignField: '_id',
                    as: 'room'
                }
            },
            { $unwind: '$room' },
            {
                $match: search ? {
                    $or: [
                        { 'user.username': { $regex: search, $options: 'i' } },
                        { 'user.email': { $regex: search, $options: 'i' } },
                        { 'room.name': { $regex: search, $options: 'i' } },
                    ]
                } : {}
            },

            // Sorting
            { $sort: { [orderBy]: sortBy === "desc" ? -1 : 1 } },

            // Pagination
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) }
        ];

        const reviews = await Review.aggregate(aggregatePipeline);
        const total = await Review.countDocuments(aggregatePipeline);
        return res.status(200).json({ message: 'Reviews fetched successfully', data: reviews, limit, page, total });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching reviews', data: error });
    }
};

// Get a review by roomId
export const getReviewByRoomId = async (req, res) => {
    try {
        const { page = 1, limit = 10, roomId } = req.query;
        const reviews = await Review.find({ room: roomId })
            .populate('user', 'username email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const total = await Review.countDocuments({ room: roomId });
        return res.status(200).json({ message: 'Reviews fetched successfully', data: reviews, total, limit, page });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching reviews', data: error });
    }
};

// Delete a review by ID
export const deleteReviewById = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        // update average rating of room
        const reviews = await Review.find({ room: review.room });
        const totalRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) : 0
        const averageRating = totalRating / (reviews.length || 1);
        await Room.findByIdAndUpdate(review.room, { rating: averageRating });
        return res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.log("🚀 ~ deleteReviewById ~ error:", error)
        return res.status(500).json({ message: 'Error deleting review', data: error });
    }
};