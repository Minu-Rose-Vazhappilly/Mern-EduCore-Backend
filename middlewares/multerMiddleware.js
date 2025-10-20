const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // You can separate folders later if needed (e.g., ./uploads/videos)
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    }
});

// File filter configuration
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'application/pdf',
        'video/mp4'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only .png, .jpg, .jpeg, .pdf, and .mp4 files are allowed!'), false);
    }
};

// Multer setup
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB max (adjust as needed)
});

module.exports = upload;
