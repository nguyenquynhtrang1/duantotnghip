import mongoose from "mongoose";
import Room from "../models/Room.js";

// Get all rooms
const getRooms = async (req, res) => {
    const {
        search,
        roomTypes,
        orderBy = "createdAt",
        sortBy = "desc",
        checkin,
        checkout,
        limit = 10,
        page = 1
    } = req.query;

    const matchConditions = {};

    // Kiểm tra và thêm điều kiện tìm kiếm
    if (search?.trim()) {
        const s = search.trim();
        matchConditions.$or = [
            { name: { $regex: s, $options: "i" } },
            { description: { $regex: s, $options: "i" } },
            { 'roomType.name': { $regex: s, $options: "i" } },
            { '_id': mongoose.Types.ObjectId.isValid(s) ? new mongoose.Types.ObjectId(s) : null }
        ];
    }

    // Thêm điều kiện roomType
    if (roomTypes && roomTypes.length > 0) {
        const ids = roomTypes.filter(id => mongoose.Types.ObjectId.isValid(id));
        if (ids.length > 0) {
            matchConditions["roomType._id"] = {
                $in: ids.map(id => new mongoose.Types.ObjectId(id))
            }
        }
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
        const result = await Room.aggregate([
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
            {
                $facet: {
                    data: [
                        { $sort: { [orderBy]: sortBy === "desc" ? -1 : 1 } },
                        { $skip: (page - 1) * limit },
                        { $limit: parseInt(limit) },
                        {
                            $project: {
                                name: 1,
                                description: 1,
                                photos: 1,
                                price: 1,
                                discount: 1,
                                roomType: 1,
                                rating: 1,
                                offeredAmenities: 1,
                                invalidDates: 1,
                                createdAt: 1,
                                updatedAt: 1
                            }
                        }
                    ],
                    total: [
                        { $count: "total" }
                    ]
                }
            },
        ]);

        const total = result?.[0]?.total?.[0]?.total || 0;
        const rooms = result?.[0]?.data || [];

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
