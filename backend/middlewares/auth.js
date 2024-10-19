import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "Invalid Token" })
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: "Invalid Token" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        console.log("🚀 ~ verifyToken ~ req:", req.user)
    } catch (err) {
        console.log("🚀 ~ verifyToken ~ err:", err)
        return res.status(403).json({ message: "TOKEN_EXPIRED" });
    }
    return next();
}

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        console.log("🚀 ~ verifyAdmin ~ req.user", req.user)
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Permissions denied" })
        }
        next();
    });
}

export { verifyToken, verifyAdmin };