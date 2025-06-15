import express from 'express';
import {getAllBuku, getDetailBuku, getBukuById, tampilkanTabelBuku, showUploadForm, showEditForm, uploadBuku, updateBuku, deleteBuku, getCover} from '../controllers/BukuController.js';
import { requireLogin } from '../controllers/AuthController.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.get('/buku', requireLogin, getAllBuku);
router.get('/home/buku/:id', requireLogin, getDetailBuku);
router.get('/buku/:id', requireLogin, getBukuById);
router.get('/tabel-buku', requireLogin, tampilkanTabelBuku);
router.get('/tabel-buku/upload', requireLogin, showUploadForm);
router.post('/tabel-buku/upload', requireLogin, upload.single('cover'), uploadBuku);
router.get('/tabel-buku/edit/:id', requireLogin, showEditForm);
router.post('/tabel-buku/edit/:id', requireLogin, upload.single('cover'), updateBuku);
router.post('/tabel-buku/delete/:id', requireLogin, deleteBuku);
router.get('/cover/:id', getCover);

export default router;
