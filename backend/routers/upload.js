import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

router.post("/", upload.array("photos", 6), async (req, res) => {
    try {
        const photos = req.files
        const uploadPromises = photos.map(async (image) => {
            const b64 = Buffer.from(image.buffer).toString("base64");
            let dataURI = "data:" + image.mimetype + ";base64," + b64;
            const res = await cloudinary.v2.uploader.upload(dataURI);
            console.log("🚀 ~ uploadPromises ~ res:", res)
            return res.url;
        });

        const imageUrls = await Promise.all(uploadPromises);
        res.json({ data: imageUrls, message: "Photos uploaded successfully" });
    } catch (error) {
        console.log("🚀 ~ router.post ~ error:", error)
    }
});

export default router;