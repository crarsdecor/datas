
import express from 'express';
import path from 'path';
import fs from 'fs';
import { uploadContacts } from '../controller/uploadController.js';
import Busboy from 'busboy';

const router = express.Router();

// Create the route for uploading contacts
router.post('/upload', (req, res) => {
  const busboy = Busboy({ headers: req.headers });
  const uploadDir = path.join('uploads');

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let filePath = '';

  busboy.on('file', (fieldname, file, filename) => {
    filePath = path.join(uploadDir, `${Date.now()}-${filename}`);
    file.pipe(fs.createWriteStream(filePath));
  });

  busboy.on('finish', () => {
    if (filePath) {
      req.file = { path: filePath };
      uploadContacts(req, res);
    } else {
      res.status(400).send('No file uploaded.');
    }
  });

  req.pipe(busboy);
});

export default router;