import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
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
            price: { type: Number, required: true },
            discount: { type: Number, default: 0 },
        }, required: true
    },
    roomType: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalCost: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" },
}, { timestamps: true });
BookingSchema.index({ roomType: 1, createdAt: 1 }, { unique: true });

export default mongoose.model("Booking", BookingSchema);
