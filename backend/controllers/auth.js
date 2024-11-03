import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const register = async (req, res) => {
    const { username, email, password, phone } = req.body;

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });
        const token = jwt.sign({ _id: user._id, email: user.email, username: user.username, isAdmin: user.isAdmin, phone: user.phone }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
        const refreshToken = jwt.sign({ _id: user._id, email: user.email, username: user.username, isAdmin: user.isAdmin, phone: user.phone }, process.env.JWT_SECRET_KEY, { expiresIn: "365d" });
        res.status(201).json({ data: { user, token, refreshToken }, message: "User created successfully" });

    } catch (error) {
        console.log("🚀 ~ register ~ error:", error)
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existing = await User.findOne({ email })
        if (!existing) {
            return res.status(404).json({ message: "User does not exist" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existing.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ _id: existing._id, email: existing.email, username: existing.username, isAdmin: existing.isAdmin, phone: existing.phone }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
        const refreshToken = jwt.sign({ _id: existing._id, email: existing.email, username: existing.username, isAdmin: existing.isAdmin, phone: existing.phone }, process.env.JWT_SECRET_KEY, { expiresIn: "365d" });

        res.status(200).json({ data: { user: existing, token, refreshToken }, message: "User logged in successfully" });

    } catch (error) {
        console.log("🚀 ~ login ~ error:", error)
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(403).send('A token is required for authentication');
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
        const token = jwt.sign({ _id: decoded._id, email: decoded.email, username: decoded.username, isAdmin: decoded.isAdmin, phone: decoded.phone }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.status(200).json({ data: { token }, message: "Token refreshed successfully" });
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
}

const logout = async (req, res) => {
    res.status(200).json({ message: "User logged out successfully" });
}

export { register, login, refreshToken, logout };