import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, },
    description: { type: String },
    roomType: { type: mongoose.Schema.Types.ObjectId, ref: "RoomType", required: true, },
    photos: { type: [String] },
    price: { type: Number, required: true, },
    discount: { type: Number, default: 0 },
    rating: { type: Number },
    offeredAmenities: { type: [String] },
    invalidDates: { type: [Date] },
}, { timestamps: true });

RoomSchema.index({ name: 1, roomType: 1 }, { unique: true });

export default mongoose.model("Room", RoomSchema);