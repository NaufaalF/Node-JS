import express from 'express';
import {
  getAllPeminjaman,
  getFormPeminjaman,
  createPeminjaman,
  updateStatusPeminjaman,
  deletePeminjaman
} from '../controllers/PeminjamanController.js';
import { requireLogin } from '../controllers/AuthController.js';

const router = express.Router();

// Route untuk fetch data peminjaman (untuk frontend)
router.get('/home/peminjaman', requireLogin, getFormPeminjaman
);

// Tampilkan semua data peminjaman (API)
router.get('/peminjaman', requireLogin, getAllPeminjaman);

// Tambah data peminjaman
router.post('/peminjaman', requireLogin, createPeminjaman);

// Update status peminjaman
router.put('/peminjaman/:id', requireLogin, updateStatusPeminjaman);

// Hapus data peminjaman
router.delete('/peminjaman/:id', requireLogin, deletePeminjaman);

export default router;
