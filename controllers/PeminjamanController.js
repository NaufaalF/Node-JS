import Peminjaman from '../models/PeminjamanModel.js';
import User from '../models/UserModel.js';
import Buku from '../models/BukuModel.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tampilkan halaman daftar peminjaman hanya untuk user yang sedang login
export const getAllPeminjaman = async (req, res) => {
  try {
    // Ambil id user dari cookie (isLoggedInId) atau session
    const userId = req.cookies && req.cookies.isLoggedInId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User belum login' });
    }
    const peminjaman = await Peminjaman.findAll({
      where: { anggota_id: userId },
      include: [User, Buku]
    });
    res.json(peminjaman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================== User ==============================

// Tampilkan form tambah peminjaman
export const getFormPeminjaman = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/user/peminjaman.html'));
};

// Tambah data peminjaman
export const createPeminjaman = async (req, res) => {
  const { anggota_id, buku_id, tanggal_pinjam, tanggal_kembali, status_peminjaman } = req.body;
  console.log({ anggota_id, buku_id, tanggal_pinjam, tanggal_kembali, status_peminjaman });
  try {
    const peminjaman = await Peminjaman.create({
      anggota_id,
      buku_id,
      tanggal_pinjam,
      tanggal_kembali: null,
      status_peminjaman
    });
    // Update status ketersediaan buku menjadi 'dipinjam'
    await Buku.update({ ketersediaan: 'dipinjam' }, { where: { id: buku_id } });
    res.status(201).json(peminjaman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================== Admin ==============================

// Update status peminjaman
export const updateStatusPeminjaman = async (req, res) => {
  const { id } = req.params;
  const { status_peminjaman } = req.body;
  try {
    const peminjaman = await Peminjaman.findByPk(id);
    if (!peminjaman) return res.status(404).json({ message: 'Data tidak ditemukan' });
    peminjaman.status_peminjaman = status_peminjaman;
    await peminjaman.save();
    res.json(peminjaman);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Hapus data peminjaman
export const deletePeminjaman = async (req, res) => {
  const { id } = req.params;
  try {
    const peminjaman = await Peminjaman.findByPk(id);
    if (!peminjaman) return res.status(404).json({ message: 'Data tidak ditemukan' });
    await peminjaman.destroy();
    res.json({ message: 'Data berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
