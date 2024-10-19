import mongoose from "mongoose";
const RoomTypeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, },
        description: { type: String, },
    },
    { timestamps: true }
);

export default mongoose.model("RoomType", RoomTypeSchema);