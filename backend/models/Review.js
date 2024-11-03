import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    user: {
        type: {
            _id: { type: String, required: true },
            username: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
        }, required: true
    },
    room: {
        type: {
            _id: { type: String, required: true },
            name: { type: String, required: true },
        }, required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
