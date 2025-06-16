import express from 'express';
import {
  getAllUlasan,
  getUlasanByBuku,
  createUlasan,
  deleteUlasan,
  updateUlasan,
  getTabelUlasan, 
  getFormUlasan,
  createUlasanAdmin,
  getFormEditUlasan,
  getUlasanById
} from '../controllers/UlasanController.js';
import { requireLogin } from '../controllers/AuthController.js';

const router = express.Router();

router.get('/tabel-ulasan/tambah', requireLogin, getFormUlasan);

router.post('/tabel-ulasan/tambah', requireLogin, createUlasanAdmin);

router.get('/tabel-ulasan/edit/:id', requireLogin, getFormEditUlasan);

router.get('/ulasan/:id', requireLogin, getUlasanById);

// Ambil semua ulasan (opsional, untuk admin)
router.get('/ulasan', getAllUlasan);
// Ambil semua ulasan untuk satu buku
router.get('/ulasan/buku/:buku_id', getUlasanByBuku);
// Tambah ulasan (user harus login)
router.post('/ulasan', requireLogin, createUlasan);
// Hapus ulasan (hanya pemilik/admin)
router.delete('/ulasan/:id', requireLogin, deleteUlasan);
// Update ulasan (hanya pemilik/admin)
router.put('/ulasan/:id', requireLogin, updateUlasan);

router.get('/tabel-ulasan', requireLogin, getTabelUlasan);

export default router;
