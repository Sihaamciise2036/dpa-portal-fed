import { Router } from 'express';
import { GridFSBucket } from 'mongodb';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { HttpError } from './http.js';

const types = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/gif': '.gif', 'image/webp': '.webp', 'application/pdf': '.pdf',
  'application/msword': '.doc', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx' };
function validSignature(buffer, mime) {
  const head = buffer.subarray(0, 12);
  if (mime === 'image/png') return head.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (mime === 'image/jpeg') return head[0] === 255 && head[1] === 216 && head[2] === 255;
  if (mime === 'image/gif') return /^GIF8[79]a/.test(head.toString('ascii'));
  if (mime === 'image/webp') return head.subarray(0,4).toString() === 'RIFF' && head.subarray(8,12).toString() === 'WEBP';
  if (mime === 'application/pdf') return head.subarray(0,5).toString() === '%PDF-';
  if (mime === 'application/msword') return head.subarray(0,8).equals(Buffer.from([208,207,17,224,161,177,26,225]));
  return head[0] === 80 && head[1] === 75 && head[2] === 3 && head[3] === 4;
}
export function fileRoutes({ db }) {
  const router = Router();
  const bucket = new GridFSBucket(db, { bucketName: 'attachments' });
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 1, fields: 2 },
    fileFilter(req, file, callback) { callback(types[file.mimetype] ? null : new HttpError(415, 'Use a PNG, JPEG, GIF, WebP, PDF or Word document.'), !!types[file.mimetype]); } });
  router.post('/upload/:folder', (req, res, next) => {
    if (!/^[a-zA-Z0-9_-]{1,50}$/.test(req.params.folder)) throw new HttpError(400, 'Invalid file folder.');
    next();
  }, upload.single('file'), async (req, res) => {
    if (!req.file) throw new HttpError(422, 'Choose a file to upload.');
    if (!validSignature(req.file.buffer, req.file.mimetype)) throw new HttpError(415, 'The file content does not match its type.');
    const fileName = randomUUID() + types[req.file.mimetype];
    const stream = bucket.openUploadStream(fileName, { metadata: { userId: req.userId, folder: req.params.folder, mime: req.file.mimetype } });
    try { await pipeline(Readable.from(req.file.buffer), stream); }
    catch (error) { await stream.abort().catch(() => {}); throw error; }
    return res.status(201).json({ success: true, message: 'File uploaded.', fileName });
  });
  router.get('/get/:folder/:name', async (req, res, next) => {
    const file = await db.collection('attachments.files').findOne({ filename: req.params.name, 'metadata.folder': req.params.folder, 'metadata.userId': req.userId });
    if (!file) throw new HttpError(404, 'File not found.');
    res.set({ 'Content-Type': file.metadata.mime, 'Content-Length': String(file.length), 'Cache-Control': 'private, no-store',
      'Content-Disposition': `${['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.metadata.mime) ? 'attachment' : 'inline'}; filename="${file.filename}"`,
      'Content-Security-Policy': "default-src 'none'; sandbox", 'Cross-Origin-Resource-Policy': 'cross-origin' });
    try { await pipeline(bucket.openDownloadStream(file._id), res); } catch (error) { if (!res.headersSent) next(error); }
  });
  return router;
}
