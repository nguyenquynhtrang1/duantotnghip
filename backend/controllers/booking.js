import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import crypto from "crypto";
import axios from "axios";
import mongoose from 'mongoose';

// Get all bookings
const getBookings = async (req, res) => {
    const {
        search,
        status,
        roomType,
        orderBy = "createdAt",
        sortBy = "desc",
        limit = 10,
        page = 1
    } = req.query;

    const matchConditions = {};

    if (status) {
        matchConditions.status = status;
    }

    if (roomType) {
        matchConditions.roomType = roomType;
    }

    if (search) {
        matchConditions.$or = [
            { 'user.username': { $regex: search, $options: 'i' } },
            { 'user.email': { $regex: search, $options: 'i' } },
            { 'room.name': { $regex: search, $options: 'i' } },
            { 'roomType': { $regex: search, $options: 'i' } },
            { '_id': mongoose.Types.ObjectId.isValid(search) ? new mongoose.Types.ObjectId(search) : null }
        ]
    }
    try {
        const bookings = await Booking.find(matchConditions)
            .sort({ [orderBy]: sortBy })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const total = await Booking.countDocuments(matchConditions);
        res.status(200).json({ data: bookings, total, page, limit, message: "Bookings retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};


// Get a single booking by ID
const getBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking does not exist" });
        }
        res.status(200).json({ data: booking, message: "Booking retrieved successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// Create a new booking
const clientCreateBooking = async (req, res) => {
    try {
        const { checkIn, checkOut, roomId } = req.body;
        const existingBooking = await Booking.findOne({
            'room._id': roomId,
            status: { $in: ["Confirmed", "Pending"] },
            $or: [
                { checkIn: { $gte: checkIn, $lt: checkOut } },
                { checkOut: { $gt: checkIn, $lte: checkOut } }
            ]
        });
        if (existingBooking) {
            return res.status(400).json({ message: "Room is already booked for the selected dates" });
        }
        const room = await Room.findById(roomId).populate('roomType')
        const noOfDays = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (24 * 60 * 60 * 1000))
        const discountPrice = room.price - (room.price / 100) * room.discount;
        const totalCost = noOfDays * discountPrice
        const body = {
            user: {
                _id: req.user._id.toString(),
                username: req.user.username,
                email: req.user.email,
                phone: req.user.phone
            },
            room: {
                _id: room._id.toString(),
                name: room.name,
                price: room.price,
                discount: room.discount
            },
            roomType: room.roomType.name,
            checkIn,
            checkOut,
            totalCost
        }
        const newBooking = new Booking(body);
        await newBooking.save();

        const listDatesBooking = getDatesBetween(checkIn, checkOut);
        await Room.findByIdAndUpdate(roomId, {
            $push: {
                invalidDates: { $each: listDatesBooking }
            }
        })
        res.status(200).json({ data: newBooking, message: "Booking created successfully" });
    } catch (error) {
        console.log("🚀 ~ clientCreateBooking ~ error:", error)
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// admin create booking
const adminCreateBooking = async (req, res) => {
    try {
        const { checkIn, checkOut, roomId, userId } = req.body;
        const existingBooking = await Booking.findOne({
            'room._id': roomId,
            status: { $in: ["Confirmed", "Pending"] },
            $or: [
                { checkIn: { $gte: checkIn, $lt: checkOut } },
                { checkOut: { $gt: checkIn, $lte: checkOut } }
            ]
        })
        if (existingBooking) {
            return res.status(400).json({ message: "Room is already booked for the selected dates" });
        }
        const user = await User.findById(userId).select('-password');
        const room = await Room.findById(roomId).populate('roomType')
        const noOfDays = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (24 * 60 * 60 * 1000))
        const discountPrice = room.price - (room.price / 100) * room.discount;
        const totalCost = noOfDays * discountPrice
        const body = {
            user: {
                _id: user._id.toString(),
                username: user.username,
                email: user.email,
                phone: user.phone
            },
            room: {
                _id: room._id.toString(),
                name: room.name,
                price: room.price,
                discount: room.discount
            },
            roomType: room.roomType.name,
            checkIn,
            checkOut,
            totalCost
        }
        const newBooking = new Booking(body);
        await newBooking.save();

        const listDatesBooking = getDatesBetween(checkIn, checkOut);
        await Room.findByIdAndUpdate(roomId, {
            $push: {
                invalidDates: { $each: listDatesBooking }
            }
        })
        res.status(200).json({ data: newBooking, message: "Booking created successfully" });
    } catch (error) {
        console.log("🚀 ~ adminCreateBooking ~ error:", error)
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// Update a booking by ID
const adminUpdateBooking = async (req, res) => {
    const { status } = req.body;
    try {
        const booking = await Booking.findOne({ _id: req.params.id });
        if (!booking) {
            return res.status(404).json({ message: "Booking does not exist" });
        }
        if (booking.status !== "Pending") {
            return res.status(400).json({ message: "Booking has confirmed or cancelled" });
        }
        booking.status = status;
        await booking.save();

        if (status === "Cancelled" || status === "Completed") {
            const listDatesBooking = getDatesBetween(booking.checkIn, booking.checkOut);
            await Room.findByIdAndUpdate(booking.room._id, {
                $pull: {
                    invalidDates: { $in: listDatesBooking }
                }
            })
        }
        res.status(200).json({ data: booking, message: "Booking updated successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// user update status booking
const clientUpdateBooking = async (req, res) => {
    const { status } = req.body;
    try {
        const booking = await Booking.findOne({ _id: req.params.id });
        if (!booking) {
            return res.status(404).json({ message: "Booking does not exist" });
        }
        booking.status = status;
        await booking.save();
        if (status === "Cancelled" || status === "Completed") {
            const listDatesBooking = getDatesBetween(booking.checkIn, booking.checkOut);
            await Room.findByIdAndUpdate(booking.room._id, {
                $pull: {
                    invalidDates: { $in: listDatesBooking }
                }
            })
        }
        res.status(200).json({ data: booking, message: "Booking updated successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// Delete a booking by ID
const deleteBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findById(id)
        if (!booking) {
            return res.status(404).json({ message: "Booking does not exist" });
        }
        const listDatesBooking = getDatesBetween(booking.checkIn, booking.checkOut);
        await Room.findByIdAndUpdate(booking.room._id, {
            $pull: {
                invalidDates: { $in: listDatesBooking }
            }
        })
        await booking.deleteOne({ _id: id });
        res.status(200).json({ message: "Booking deleted successfully" });
    }
    catch (error) {
        console.log("🚀 ~ deleteBooking ~ error:", error)
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// Get all bookings for a specific user
const getUserBookings = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        const bookings = await Booking.find({ 'user._id': req.user._id })
            .sort({ createdAt: -1 });
        return res.status(200).json({ data: bookings, message: "Bookings retrieved successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

const getRevenueByMonth = async (req, res) => {
    const { year = 2024 } = req.query;
    try {
        // Sử dụng $match để lọc booking theo năm dựa trên trường checkIn
        const matchStage = {
            $match: {
                status: "Confirmed",
                $expr: { $eq: [{ $year: "$createdAt" }, Number(year)] }  // Lọc theo năm
            }
        };

        // Nhóm theo tháng và tính tổng doanh thu + số lượng đặt phòng
        const groupStage = {
            $group: {
                _id: { month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } } },  // Nhóm theo tháng
                totalRevenue: { $sum: "$totalCost" },
                bookings: { $sum: 1 }
            }
        };

        // Dựng kết quả cho biểu đồ cột
        const projectStage = {
            $project: {
                _id: 0,
                month: "$_id.month",  // Trả về tháng
                totalRevenue: 1,
                bookings: 1
            }
        };

        // Sắp xếp theo thứ tự tháng tăng dần
        const sortStage = { $sort: { month: 1 } };

        // Thực thi truy vấn
        const result = await Booking.aggregate([matchStage, groupStage, projectStage, sortStage]);
        return res.status(200).json({ data: result, message: "Revenue retrieved successfully" });
    } catch (error) {
        console.log("🚀 ~ getRevenueByMonth ~ error:", error)
    }
};

const getRevenueByRoomType = async (req, res) => {
    const { year = 2024 } = req.query;
    try {
        // Sử dụng $match để lọc booking theo năm dựa trên trường checkIn
        const matchStage = {
            $match: {
                status: "Confirmed",
                $expr: { $eq: [{ $year: "$createdAt" }, Number(year)] }  // Lọc theo năm
            }
        };

        // Nhóm theo loại phòng và tính tổng doanh thu + số lượng đặt phòng
        const groupStage = {
            $group: {
                _id: "$roomType",  // Nhóm theo loại phòng
                totalRevenue: { $sum: "$totalCost" },
                bookings: { $sum: 1 }
            }
        };

        // Dựng kết quả cho biểu đồ tròn
        const projectStage = {
            $project: {
                _id: 0,
                roomType: "$_id",  // Trả về loại phòng
                totalRevenue: 1,
                bookings: 1
            }
        };

        // Sắp xếp theo tổng doanh thu giảm dần
        const sortStage = { $sort: { totalRevenue: -1 } };

        // Thực thi truy vấn
        const result = await Booking.aggregate([matchStage, groupStage, projectStage, sortStage]);
        return res.status(200).json({ data: result, message: "Revenue retrieved successfully" });
    } catch (error) {
        console.log("🚀 ~ getRevenueByRoomType ~ error:", error)
    }
};

const getTotal = async (req, res) => {
    try {
        const totalByStatus = await Booking.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    status: "$_id",
                    count: 1
                }
            },
            // Thêm các trạng thái mặc định với giá trị 0 nếu không có trong dữ liệu
            {
                $addFields: {
                    defaultStatuses: [
                        { status: "Confirmed", count: 0 },
                        { status: "Pending", count: 0 },
                        { status: "Cancelled", count: 0 }
                    ]
                }
            },
            {
                $unwind: "$defaultStatuses"
            },
            {
                $group: {
                    _id: "$defaultStatuses.status",
                    count: { $max: { $cond: [{ $eq: ["$status", "$defaultStatuses.status"] }, "$count", 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    status: "$_id",
                    count: 1
                }
            },
            // Thêm trường sortOrder để sắp xếp theo thứ tự tùy chỉnh
            {
                $addFields: {
                    sortOrder: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$status", "Confirmed"] }, then: 0 },
                                { case: { $eq: ["$status", "Pending"] }, then: 1 },
                                { case: { $eq: ["$status", "Cancelled"] }, then: 2 }
                            ],
                            default: 3
                        }
                    }
                }
            },
            // Sắp xếp theo trường sortOrder
            {
                $sort: { sortOrder: 1 }
            },
            // Loại bỏ trường sortOrder trước khi trả kết quả
            {
                $project: { sortOrder: 0 }
            }
        ]);

        res.status(200).json({ data: totalByStatus, message: "Total bookings retrieved successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};


function getDatesBetween(startDate, endDate) {
    let dates = [];
    let currentDate = new Date(startDate);

    while (currentDate < new Date(endDate)) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}


// create payment
const createUrlPayment = async (req, res) => {
    const config = {
        accessKey: "F8BBA842ECF85",
        secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
        orderInfo: "Pay with MoMo",
        partnerCode: "MOMO",
        ipnUrl: process.env.IPN_URL,
        requestType: "payWithMethod",
        extraData: "",
        orderGroupId: "",
        autoCapture: true,
        lang: "vi",
    };

    const {
        accessKey,
        secretKey,
        orderInfo,
        partnerCode,
        ipnUrl,
        requestType,
        extraData,
        orderGroupId,
        autoCapture,
        lang,
    } = config;

    const booking = await Booking.findById(req.body.bookingId)
    if (!booking) {
        return res.status(404).json({ message: "Booking does not exist" });
    }

    const requestId = partnerCode + new Date().getTime();

    var rawSignature =
        "accessKey=" +
        accessKey +
        "&amount=" +
        booking.totalCost +
        "&extraData=" +
        extraData +
        "&ipnUrl=" +
        ipnUrl +
        "&orderId=" +
        booking._id +
        "&orderInfo=" +
        orderInfo +
        "&partnerCode=" +
        partnerCode +
        "&redirectUrl=" +
        `${process.env.FRONTEND_URL}/profile` +
        "&requestId=" +
        requestId +
        "&requestType=" +
        requestType;

    var signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: booking.totalCost,
        orderId: booking._id,
        orderInfo: orderInfo,
        redirectUrl: `${process.env.FRONTEND_URL}/profile`,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature,
    });

    // options for axios
    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(requestBody),
        },
        data: requestBody,
    };

    // Send the request and handle the response
    const result = await axios(options);
    return res.json({ data: result.data, message: "Payment created successfully" });
};

const paymentWebhook = async (req, res) => {
    const {
        orderId,
        resultCode,
    } = req.body;

    await Booking.findByIdAndUpdate(orderId, {
        status: resultCode === 0 ? "Confirmed" : "Cancelled"
    });
    return res.json({ message: "Payment webhook received" });
}

const scheduleUpdateBooking = async () => {
    const oneHourAgo = new Date(Date.now() - 15 * 60 * 1000);
    const bookings = await Booking.find({ status: "Pending", createdAt: { $lt: oneHourAgo } });
    for (const booking of bookings) {
        booking.status = "Cancelled";
        await booking.save();
        const listDatesBooking = getDatesBetween(booking.checkIn, booking.checkOut);
        await Room.findByIdAndUpdate(booking.room._id, {
            $pull: {
                invalidDates: { $in: listDatesBooking }
            }
        })
    }
}

export {
    getBookings,
    getBooking,
    clientCreateBooking,
    adminCreateBooking,
    adminUpdateBooking,
    clientUpdateBooking,
    deleteBooking,
    getUserBookings,
    getRevenueByMonth,
    getRevenueByRoomType,
    getTotal,
    createUrlPayment,
    paymentWebhook,
    scheduleUpdateBooking
};