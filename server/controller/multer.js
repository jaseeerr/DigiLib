const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the storage location and filenames
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadPath = path.join(__dirname, 'public', 'reports');
        fs.mkdirSync(uploadPath, { recursive: true }); // Ensure the directory exists
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        // Generate a unique file name to prevent overwriting
        const fileExt = path.extname(file.originalname);
        const fileName = file.fieldname + '-' + Date.now() + fileExt;
        cb(null, fileName);
    }
});

// File filter can be adjusted to accept other types or specific file types only
const fileFilter = (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);
};

// Initialize multer with the specified storage engine, file filter, and size limit
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 250 } // Limit filesize to 5MB
});

module.exports = upload;
