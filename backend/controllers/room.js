import Room from "../models/Room.js";

// Get all rooms
const getRooms = async (req, res) => {
    const {
        search,
        roomType,
        isFeatured,
        orderBy = "createdAt",
        sortBy = "desc",
        limit = 10,
        page = 1
    } = req.query;
    const conditions = {};
    if (search) {
        conditions.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }
    if (roomType) {
        conditions.roomType = roomType;
    }

    if (isFeatured) {
        conditions.isFeatured = isFeatured;
    }

    try {
        const rooms = await Room.find(conditions)
            .populate("roomType")
            .sort({ [orderBy]: sortBy })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const total = await Room.countDocuments(conditions);

        res.status(200).json({ data: rooms, total, message: "Rooms retrieved successfully" });
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

export { getRooms, getRoom, createRoom, updateRoom, deleteRoom, getTotal };
