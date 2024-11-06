import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const createUser = async (req, res) => {
    const { username, email, phone, password, isAdmin } = req.body;
    try {
        const existing = await User.findOne({ email })
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword, isAdmin, phone });
        user.password = undefined;
        res.status(201).json({ data: user, message: "User created successfully" });

    } catch (error) {
        console.log("🚀 ~ createUser ~ error:", error)
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const getUsers = async (req, res) => {
    try {
        const {
            search,
            page = 1,
            limit = 10,
            orderBy = "createdAt",
            sortBy = "desc"
        } = req.query
        const conditions = {};
        if (search?.trim()) {
            conditions.$or = [
                { username: { $regex: search.trim(), $options: "i" } },
                { email: { $regex: search.trim(), $options: "i" } },
                { '_id': mongoose.Types.ObjectId.isValid(search.trim()) ? new mongoose.Types.ObjectId(search.trim()) : null }
            ];
        }
        const users = await User.find(conditions)
            .select('-password')
            .sort({ [orderBy]: sortBy })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const total = await User.countDocuments(conditions);
        res.status(200).json({ data: users, page, limit, total, message: "Users retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        res.status(200).json({ data: user, message: "User retrieved successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json({ data: user, message: "User retrieved successfully" });
    } catch (error) {
        console.log("🚀 ~ getProfile ~ error:", error)
    }
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true }).select('-password');
        res.status(200).json({ data: user, message: "User updated successfully" });
    }
    catch (error) {
        console.log("🚀 ~ updateUser ~ error:", error)
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// chane password user
const changePassword = async (req, res) => {
    console.log(req.user)
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" })
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        console.log("🚀 ~ changePassword ~ err:", err)
        res.status(500).json({ message: "Something went wrong" });
    }
}

const getTotal = async (req, res) => {
    try {
        const total = await User.countDocuments();
        res.status(200).json({ data: total, message: "Total users retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export { createUser, getProfile, getUsers, getUser, updateUser, deleteUser, changePassword, getTotal };

