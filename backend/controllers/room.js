import mongoose from "mongoose";
import Room from "../models/Room.js";

// Get all rooms
const getRooms = async (req, res) => {
    const {
        search,
        roomType,
        orderBy = "createdAt",
        sortBy = "desc",
        checkin,
        checkout,
        limit = 10,
        page = 1
    } = req.query;

    const matchConditions = {};

    // Kiểm tra và thêm điều kiện tìm kiếm
    if (search) {
        matchConditions.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { 'roomType.name': { $regex: search, $options: "i" } },
            { '_id': mongoose.Types.ObjectId.isValid(search) ? new mongoose.Types.ObjectId(search) : null }
        ];
    }

    // Thêm điều kiện roomType
    if (roomType) {
        matchConditions["roomType._id"] = new mongoose.Types.ObjectId(roomType);
    }

    if (checkin && checkout) {
        matchConditions.invalidDates = {
            $not: {
                $elemMatch: {
                    $gte: new Date(checkin),
                    $lt: new Date(checkout)
                }
            }
        }
    }

    try {
        const rooms = await Room.aggregate([
            {
                $lookup: {
                    from: "roomtypes",
                    localField: "roomType",
                    foreignField: "_id",
                    as: "roomType"
                }
            },
            {
                $unwind: {
                    path: "$roomType",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: matchConditions
            },
            // Sorting
            { $sort: { [orderBy]: sortBy === "desc" ? -1 : 1 } },

            // Pagination
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) }
        ]);

        const total = rooms.length;
        res.status(200).json({ data: rooms, total, message: "Rooms retrieved successfully" });
    } catch (error) {
        console.error(error); // log lỗi
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json({ data: rooms, message: "Rooms retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// Get a single room by ID
const getRoom = async (req, res) => {
    const { id } = req.params;

    try {
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ message: "Room does not exist" });
        }
        res.status(200).json({ data: room, message: "Room retrieved successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// Create a new room
const createRoom = async (req, res) => {
    try {
        const newRoom = new Room(req.body);
        await newRoom.save();
        res.status(201).json({ data: newRoom, message: "Room created successfully" });
    } catch (error) {
        console.log("🚀 ~ createRoom ~ error:", error)
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// Update a room by ID
const updateRoom = async (req, res) => {
    const { id } = req.params;

    try {
        const room = await Room.findByIdAndUpdate(id, req.body, { new: true });
        if (!room) {
            return res.status(404).json({ message: "Room does not exist" });
        }
        res.status(200).json({ data: room, message: "Room updated successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// Delete a room by ID
const deleteRoom = async (req, res) => {
    const { id } = req.params;

    try {
        const room = await Room.findByIdAndDelete(id);
        if (!room) {
            return res.status(404).json({ message: "Room does not exist" });
        }
        res.status(200).json({ message: "Room deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const getTotal = async (req, res) => {
    try {
        const total = await Room.countDocuments();
        res.status(200).json({ data: total, message: "Total rooms retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const getTotalByRoomType = async (req, res) => {
    try {
        const total = await Room.aggregate([
            {
                $lookup: {
                    from: "roomtypes",
                    localField: "roomType",
                    foreignField: "_id",
                    as: "roomType"
                }
            },
            {
                $unwind: "$roomType"
            },
            {
                $group: {
                    _id: "$roomType",
                    total: { $sum: 1 },
                    name: { $first: "$roomType.name" }
                }
            }
        ]);
        res.status(200).json({ data: total, message: "Total rooms by room type retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export { getRooms, getAllRooms, getRoom, createRoom, updateRoom, deleteRoom, getTotal, getTotalByRoomType };
