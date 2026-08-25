import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDirectory = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadsDirectory);
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const baseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-z0-9_-]/gi, '-')
      .replace(/-+/g, '-')
      .slice(0, 60);

    callback(null, `${Date.now()}-${baseName || 'product'}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
      callback(null, true);
      return;
    }

    callback(new Error('Only image files are allowed.'));
  },
});

export default upload;
