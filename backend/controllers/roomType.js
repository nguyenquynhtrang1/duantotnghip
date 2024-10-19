import RoomType from '../models/RoomType.js'; // Adjust the path as necessary

// Create a new room type
const createRoomType = async (req, res) => {
    const { name, description } = req.body;

    try {
        const newRoomType = new RoomType({ name, description });
        await newRoomType.save();
        res.status(201).json({ data: newRoomType, message: 'Room type created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all room types
const getAllRoomTypes = async (req, res) => {
    const {
        page = 1,
        limit = 10,
        orderBy = 'createdAt',
        sortBy = 'desc',
        search
    } = req.query
    const conditions = {};
    if (search) {
        conditions.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    try {
        const roomTypes = await RoomType.find(conditions)
            .sort({ [orderBy]: sortBy })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const total = await RoomType.countDocuments(conditions)
        res.status(200).json({ data: roomTypes, page, limit, total, message: 'Room types retrieved successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};


// Get a single room type by ID
const getRoomTypeById = async (req, res) => {
    const { id } = req.params;

    try {
        const roomType = await RoomType.findById(id);
        if (!roomType) {
            return res.status(404).json({ error: 'Room type not found' });
        }
        res.status(200).json({ data: roomType, message: 'Room type retrieved successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a room type by ID
const updateRoomTypeById = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const roomType = await RoomType.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );
        if (!roomType) {
            return res.status(404).json({ error: 'Room type not found' });
        }
        res.status(200).json({ data: roomType, message: 'Room type updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a room type by ID
const deleteRoomTypeById = async (req, res) => {
    const { id } = req.params;

    try {
        const roomType = await RoomType.findByIdAndDelete(id);
        if (!roomType) {
            return res.status(404).json({ error: 'Room type not found' });
        }
        res.status(200).json({ message: 'Room type deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

export {
    createRoomType,
    getAllRoomTypes,
    getRoomTypeById,
    updateRoomTypeById,
    deleteRoomTypeById
};
