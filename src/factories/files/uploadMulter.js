// @ts-check

import multer, { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'files/'); // Pasta onde as imagens serão armazenadas
  },
  filename: (req, file, cb) => {
    const ext = extname(file.originalname);
    cb(null, Date.now() + ext); // Nome do arquivo para evitar colisões
  },
});

const uploadMulter = multer({ storage });

export default uploadMulter;