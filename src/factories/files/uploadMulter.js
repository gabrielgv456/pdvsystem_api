const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'files/'); // Pasta onde as imagens serão armazenadas
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Nome do arquivo para evitar colisões
  },
});

const uploadMulter = multer({ storage });

module.exports = uploadMulter;