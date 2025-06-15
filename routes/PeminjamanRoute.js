import express from 'express';
import {
  getAllPeminjaman,
  getFormPeminjaman,
  createPeminjaman,
  updateStatusPeminjaman,
  deletePeminjaman,
  tampilkanTabelPeminjaman,
  showUploadForm,
  showEditForm,
  updatePeminjaman,
  createPeminjamanAdmin
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

//buat atmint

// Tampilkan tabel peminjaman
router.get('/tabel-peminjaman', requireLogin, tampilkanTabelPeminjaman)

// Tambah peminjaman
router.get('/tabel-peminjaman/tambah', requireLogin, showUploadForm)
router.post('/tabel-peminjaman/tambah', requireLogin, createPeminjamanAdmin)

// Edit Peminjaman
router.get('/tabel-peminjaman-edit/:id', showEditForm)
router.post('/tabel-peminjaman-edit/:id', updatePeminjaman)

// Update status peminjaman
router.put('/peminjaman/:id', requireLogin, updateStatusPeminjaman);

// Hapus data peminjaman
router.post('/tabel-peminjaman/delete/:id', requireLogin, deletePeminjaman);

export default router;
