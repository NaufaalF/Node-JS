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
  const { users_id, buku_id, tanggal_pinjam, tanggal_kembali, status_peminjaman } = req.body;
  console.log({ users_id, buku_id, tanggal_pinjam, tanggal_kembali, status_peminjaman });
  try {
    const peminjaman = await Peminjaman.create({
      users_id,
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

export const tampilkanTabelPeminjaman = async (req, res) => {
  try {
    // Data peminjaman bisa di-fetch via API di frontend
    res.sendFile(path.join(__dirname, '../views/admin/tabel peminjaman/peminjaman.html'));
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};

export const showUploadForm = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/tabel peminjaman/tambahPeminjaman.html'));
};

export const showEditForm = async (req, res) => {
  try {
    const users = await User.findByPk(req.params.id);
    if (!users) return res.redirect('/tabel-user');
    // Data user bisa di-fetch via API di frontend
    res.sendFile(path.join(__dirname, '../views/admin/tabel user/editUser.html'));
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};

// Update user (POST)
export const updatePeminjaman = async (req, res) => {
  try {
    const peminjaman = await Peminjaman.findByPk(req.params.id);
    if (!peminjaman) return res.redirect('/tabel-peminjaman');
    const { users_id, buku_id, tanggal_pinjam, tanggal_kembali, status_peminjaman } = req.body;
    peminjaman.users_id = users_id;
    peminjaman.buku_id = buku_id;
    peminjaman.tanggal_pinjam = tanggal_pinjam;
    peminjaman.tanggal_kembali = tanggal_kembali;
    peminjaman.status_peminjaman = status_peminjaman;
    await peminjaman.save();
    res.redirect('/tabel-peminjaman');
  } catch (err) {
    res.status(500).send('Gagal update user: ' + err.message);
  }
};

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
