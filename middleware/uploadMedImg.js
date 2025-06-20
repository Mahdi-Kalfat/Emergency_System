const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/medicament');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const currentDate = new Date().toISOString().split('T')[0];
        const randomName = `${req.body.nom}-${currentDate}-${crypto.randomBytes(8).toString('hex')}${path.extname(file.originalname)}`;
        cb(null, randomName);
    }
});

const fileUpload = multer({ storage });

module.exports = fileUpload;